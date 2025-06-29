package response

import (
	"encoding/json"
	"git.rinsvent.ru/rinsvent/indicator/internal/models"
	"iter"
	"time"
)

type OkResponse struct {
	Body struct{}
}

type IndicatorsResponse struct {
	Body Indicators
}

type Indicators []Indicator

type Indicator struct {
	Code       string          `json:"code"`
	Type       models.Type     `json:"type"`
	Level      models.Level    `json:"level"`
	Settings   json.RawMessage `json:"settings"`
	Ttl        int             `json:"ttl"`
	Link       string          `json:"link"`
	Text       string          `json:"text"`
	Tags       []string        `json:"tags"`
	PingAt     time.Time       `json:"pingAt"`
	RevisionAt time.Time       `json:"revisionAt"`
}

func BuildIndicatorsFromModels(indicators iter.Seq[*models.Indicator]) Indicators {
	var result = make(Indicators, 0)
	for indicator := range indicators {
		result = append(result, BuildIndicatorFromModel(indicator))
	}
	return result
}

func BuildIndicatorFromModel(indicator *models.Indicator) Indicator {
	s := Indicator{}
	s.Code = indicator.Code
	s.Type = indicator.Type
	s.Level = indicator.Level
	s.Settings = indicator.Settings
	s.Ttl = indicator.Ttl
	s.Link = indicator.Link
	s.Text = indicator.Text
	s.Tags = indicator.Tags
	s.PingAt = indicator.PingAt
	s.RevisionAt = indicator.RevisionAt

	return s
}

type DeleteIndicatorMessage struct {
	Code string `json:"code"`
}
