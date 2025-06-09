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
	Level models.Level `json:"level,omitempty"`
	Ttl   int          `json:"ttl,omitempty"`
	Link  string       `json:"link,omitempty"`
	Text  string       `json:"text,omitempty"`
	Tags  []string     `json:"tags,explode,omitempty"`
}

type DeleteIndicatorRequest struct {
	Code string `path:"code"`
}
