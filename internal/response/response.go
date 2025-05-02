package response

import (
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
	Code      string       `json:"code"`
	Level     models.Level `json:"level"`
	Ttl       int          `json:"ttl"`
	Link      string       `json:"link"`
	Text      string       `json:"text"`
	Tags      []string     `json:"tags"`
	UpdatedAt time.Time    `json:"updatedAt"`
}

func BuildIndicatorsFromModels(indicators iter.Seq[*models.Indicator]) Indicators {
	var result Indicators
	for indicator := range indicators {
		result = append(result, BuildIndicatorFromModel(indicator))
	}
	return result
}

func BuildIndicatorFromModel(indicator *models.Indicator) Indicator {
	s := Indicator{}
	s.Code = indicator.Code
	s.Level = indicator.Level
	s.Ttl = indicator.Ttl
	s.Link = indicator.Link
	s.Text = indicator.Text
	s.Tags = indicator.Tags
	s.UpdatedAt = indicator.UpdatedAt

	return s
}
