package controller

import (
	"github.com/danielgtaylor/huma/v2/humatest"
	"github.com/joho/godotenv"
	"testing"
)

func TestMain(m *testing.M) {
	godotenv.Load("../../.env.test")

	m.Run()
}

func api(t *testing.T) humatest.TestAPI {
	_, ha := humatest.New(t)
	addRoutes(ha)
	return ha
}
