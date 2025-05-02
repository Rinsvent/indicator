package controller

import (
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humagin"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
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
}
