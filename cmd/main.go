package main

import (
	"git.rinsvent.ru/rinsvent/indicator/internal/controller"
	"github.com/joho/godotenv"
	"net/http"
)

func main() {
	godotenv.Load(".env")
	err := http.ListenAndServe("0.0.0.0:8012", controller.MakeRouter())
	if err != nil {
		panic(err)
	}
}
