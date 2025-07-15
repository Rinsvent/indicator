package main

import (
	"context"
	"fmt"
	"git.rinsvent.ru/rinsvent/indicator/internal/controller"
	"git.rinsvent.ru/rinsvent/indicator/internal/service"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
	"github.com/urfave/cli/v3"
	"log"
	"net/http"
	"os"
	"time"
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
					cr := cron.New(cron.WithSeconds(), cron.WithChain(cron.SkipIfStillRunning(cron.DefaultLogger)))
					cr.AddFunc("*/5 * * * * *", func() {
						fmt.Println("Background check was handled")
						service.IM().Check()
						time.Sleep(time.Second * 20)
					})
					cr.Start()

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
