package web

import (
	"embed"
)

//go:embed out/*
var StaticFiles embed.FS
