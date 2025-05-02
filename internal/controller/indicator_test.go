package controller

import (
	"git.rinsvent.ru/rinsvent/indicator/internal/models"
	"git.rinsvent.ru/rinsvent/indicator/internal/request"
	"git.rinsvent.ru/rinsvent/indicator/internal/service"
	"git.rinsvent.ru/rinsvent/indicator/internal/tests"
	"net/http"
	"strconv"
	"strings"
	"testing"
	"time"
)

func TestGetIndicators(t *testing.T) {
	updatedAt, _ := time.Parse(time.RFC3339, "2014-11-12T11:45:26.373Z")
	service.IM().ClearAll()
	service.IM().Persist(models.Indicator{
		Code:      "phpstan",
		Level:     models.CriticalLevel,
		Ttl:       20,
		Text:      "Has errors",
		Tags:      []string{"prod", "ci"},
		Link:      "https://tc.com/phpstan",
		UpdatedAt: updatedAt,
	})

	resp := api(t).Get("/v1/indicators")

	if resp.Code != http.StatusOK {
		t.Fatalf("Unexpected response code: %d", resp.Code)
	}

	tests.AssertFile(t, "../../tests/responses/v1/indicators/indicators.json", tests.PrettyJson(resp.Body.String()), false)
}

func TestUpdateNotExistsIndicator(t *testing.T) {
	service.IM().ClearAll()

	body := request.UpsertIndicatorBody{
		Level: models.SuccessLevel,
		Ttl:   23,
		Link:  "http://vk.com",
		Text:  "Not available",
		Tags:  []string{"sdf", "fds"},
	}
	resp := api(t).Patch("/v1/indicators/phpstan", body)

	if resp.Code != http.StatusOK {
		t.Fatalf("Unexpected response code: %d", resp.Code)
	}

	indicators := service.IM().Find()
	var indicatorCount = 0
	for indicator := range indicators {
		if indicator.Code != "phpstan" {
			t.Fatalf("Indicator code not equal phpstan")
		}

		if indicator.Level != body.Level {
			t.Fatalf("Indicator level not equal " + string(body.Level))
		}

		if indicator.Ttl != body.Ttl {
			t.Fatalf("Indicator ttl not equal " + strconv.Itoa(body.Ttl))
		}

		if indicator.Link != body.Link {
			t.Fatalf("Indicator link not equal " + body.Link)
		}

		if indicator.Text != body.Text {
			t.Fatalf("Indicator text not equal " + body.Text)
		}

		if strings.Join(indicator.Tags, "/") != strings.Join(body.Tags, "/") {
			t.Fatalf("Indicator text not equal " + strings.Join(body.Tags, "/"))
		}

		indicatorCount = indicatorCount + 1
	}
	if indicatorCount != 1 {
		t.Fatalf("Indicator count not equal 1")
	}
}

func TestUpdateExistsIndicator(t *testing.T) {
	updatedAt, _ := time.Parse(time.RFC3339, "2014-11-12T11:45:26.373Z")
	service.IM().ClearAll()
	service.IM().Persist(models.Indicator{
		Code:      "phpstan",
		Level:     models.CriticalLevel,
		Ttl:       20,
		Text:      "Has errors",
		Tags:      []string{"prod", "ci"},
		Link:      "https://tc.com/phpstan",
		UpdatedAt: updatedAt,
	})

	body := request.UpsertIndicatorBody{
		Level: models.SuccessLevel,
		Ttl:   23,
		Link:  "http://vk.com",
		Text:  "Not available",
		Tags:  []string{"sdf", "fds"},
	}
	resp := api(t).Patch("/v1/indicators/phpstan", body)

	if resp.Code != http.StatusOK {
		t.Fatalf("Unexpected response code: %d", resp.Code)
	}

	indicators := service.IM().Find()
	var indicatorCount = 0
	for indicator := range indicators {
		if indicator.Code != "phpstan" {
			t.Fatalf("Indicator code not equal phpstan")
		}

		if indicator.Level != body.Level {
			t.Fatalf("Indicator level not equal " + string(body.Level))
		}

		if indicator.Ttl != body.Ttl {
			t.Fatalf("Indicator ttl not equal " + strconv.Itoa(body.Ttl))
		}

		if indicator.Link != body.Link {
			t.Fatalf("Indicator link not equal " + body.Link)
		}

		if indicator.Text != body.Text {
			t.Fatalf("Indicator text not equal " + body.Text)
		}

		if strings.Join(indicator.Tags, "/") != strings.Join(body.Tags, "/") {
			t.Fatalf("Indicator text not equal " + strings.Join(body.Tags, "/"))
		}

		indicatorCount = indicatorCount + 1
	}

	if indicatorCount != 1 {
		t.Fatalf("Indicator count not equal 1")
	}
}
