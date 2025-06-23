package controller

import (
	"git.rinsvent.ru/rinsvent/indicator/internal/response"
	"git.rinsvent.ru/rinsvent/indicator/security"
	"git.rinsvent.ru/rinsvent/indicator/web"
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humagin"
	"github.com/danielgtaylor/huma/v2/sse"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"io/fs"
	"net/http"
	"os"
	"strings"
	"time"
)

type GreetingOutput struct {
	Body struct {
		Message string `json:"message" example:"Hello, world!" doc:"Greeting message"`
	}
}

func MakeRouter() http.Handler {
	var store = sessions.NewCookieStore(
		[]byte(os.Getenv("SESSION_SECRET")),         // Подпись
		[]byte(os.Getenv("SESSION_ENCRYPTION_KEY")), // Шифрование (опционально)
	)

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		session, _ := store.Get(c.Request, "auth-session")
		if userId, ok := session.Values["userId"].(string); ok && userId != "" {
			return
		}

		firewall, user, err := security.CheckFirewalls(c.Request)
		if err != nil {
			realm := firewall.GetConfigAuthenticator().HttpBasic.Realm
			c.Header("WWW-Authenticate", `Basic realm="`+realm+`", charset="UTF-8"`)
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if firewall != nil && user != nil && err == nil {
			session.Values["userId"] = user.GetId()
		}

		if err := session.Save(c.Request, c.Writer); err != nil {
			http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://indicator.rinsvent.ru"},
		AllowMethods:     []string{"PUT", "PATCH", "POST", "GET", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "Accept-Encoding"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000" || origin == "https://indicator.rinsvent.ru"
		},
		MaxAge: 12 * time.Hour,
	}))

	config := huma.DefaultConfig("Indicators API", "1.0.0")
	config.Servers = []*huma.Server{
		{URL: "http://localhost:8012"},
	}
	api := humagin.New(r, config)

	addRoutes(api)

	setupStatic(r)

	return r
}

func addRoutes(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:        http.MethodGet,
		Path:          "/v1/indicators",
		DefaultStatus: http.StatusOK,
	}, GetIndicatorsHandler)

	huma.Register(api, huma.Operation{
		Method:        http.MethodPatch,
		Path:          "/v1/indicators/:code",
		DefaultStatus: http.StatusOK,
	}, UpsertIndicatorHandler)

	huma.Register(api, huma.Operation{
		Method:        http.MethodDelete,
		Path:          "/v1/indicators/:code",
		DefaultStatus: http.StatusOK,
	}, DeleteIndicatorHandler)

	sse.Register(api, huma.Operation{
		OperationID: "sse",
		Method:      http.MethodGet,
		Path:        "/sse",
		Summary:     "Server sent events",
	}, map[string]any{
		"indicatorUpdated": response.Indicator{},
		"indicatorDeleted": response.DeleteIndicatorMessage{},
	}, SSEHandler)
}

func setupStatic(router *gin.Engine) {
	// Извлекаем вложенную файловую систему
	subFS, err := fs.Sub(web.StaticFiles, "out")
	if err != nil {
		panic("Failed to create sub filesystem: " + err.Error())
	}

	// Создаем обработчик файлов
	fileServer := http.FileServer(http.FS(subFS))

	// Обработчик статики для всех путей, кроме API
	router.NoRoute(func(c *gin.Context) {
		// Пропускаем запросы, начинающиеся с /api
		if strings.HasPrefix(c.Request.URL.Path, "/v1") {
			c.Next()
			return
		}

		// Для корневого пути
		if c.Request.URL.Path == "/" {
			if data, err := fs.ReadFile(subFS, "index.html"); err == nil {
				c.Data(http.StatusOK, "text/html; charset=utf-8", data)
				return
			}
		}

		// Пытаемся получить файл
		if _, err := subFS.Open(strings.TrimPrefix(c.Request.URL.Path, "/")); err == nil {
			fileServer.ServeHTTP(c.Writer, c.Request)
			return
		}

		// Fallback для SPA - отдаем 404.html
		if data, err := fs.ReadFile(subFS, "404.html"); err == nil {
			c.Data(http.StatusNotFound, "text/html; charset=utf-8", data)
			return
		}

		// Если index.html не найден
		c.Status(http.StatusNotFound)
	})
}
