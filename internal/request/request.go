package request

import "git.rinsvent.ru/rinsvent/indicator/internal/models"

type GetIndicatorsRequest struct {
	Code string   `query:"code"`
	Tags []string `query:"tags,explode"`
}

type UpsertIndicatorRequest struct {
	Code string `path:"code"`
	Body UpsertIndicatorBody
}

type UpsertIndicatorBody struct {
	Level models.Level `json:"level"`
	Ttl   int          `json:"ttl"`
	Link  string       `json:"link"`
	Text  string       `json:"text"`
	Tags  []string     `json:"tags,explode"`
}
