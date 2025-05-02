package main

import (
	"context"
	"git.rinsvent.ru/rinsvent/indicator/internal/controller"
	"github.com/joho/godotenv"
	"github.com/urfave/cli/v3"
	"log"
	"net/http"
	"os"
)

func main() {
	godotenv.Load("./.env")
	app := &cli.Command{
		Name:                  "indicator",
		Usage:                 "Service to collect indicators",
		EnableShellCompletion: true,
		Commands: []*cli.Command{
			{
				Name:     "server:start",
				Category: "server",
				Aliases:  []string{"s"},
				Usage:    "Start web server",
				Action: func(ctx context.Context, c *cli.Command) error {
					err := http.ListenAndServe("0.0.0.0:8012", controller.MakeRouter())
					if err != nil {
						return err
					}
					return nil
				},
			},
		},
	}

	ctx := context.Background()
	if err := app.Run(ctx, os.Args); err != nil {
		log.Fatal(err)
	}
}
