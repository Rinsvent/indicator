package controller

import (
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humagin"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
	"time"
)

type GreetingOutput struct {
	Body struct {
		Message string `json:"message" example:"Hello, world!" doc:"Greeting message"`
	}
}

func MakeRouter() http.Handler {
	r := gin.Default()

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
		{URL: "http://localhost"},
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
}

func setupStatic(router *gin.Engine) {
	// Обработчик статики для всех путей, кроме API
	router.NoRoute(func(c *gin.Context) {
		// Пропускаем запросы, начинающиеся с /api
		if strings.HasPrefix(c.Request.URL.Path, "/v1") {
			c.Next()
			return
		}

		// Проверяем существование файла
		fs := http.Dir("./web/out")
		filepath := c.Request.URL.Path
		if _, err := fs.Open(filepath); err != nil {
			// Файл не найден - отдаем index.html
			c.Status(http.StatusNotFound)
			c.File("./web/out/404.html")
			return
		}

		// Отдаем статический файл
		c.File("./web/out" + filepath)
	})
}
