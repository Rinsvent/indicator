package service

import (
	"git.rinsvent.ru/rinsvent/indicator/internal/models"
	"git.rinsvent.ru/rinsvent/indicator/internal/request"
	"iter"
	"time"
)

var im *IndicatorManager

type IndicatorManager struct {
	indicators map[string]*models.Indicator
}

func (im *IndicatorManager) Upsert(code string, d request.UpsertIndicatorBody) (*models.Indicator, bool) {
	i := im.GrabIndicator(code)

	hasChanges := false
	if d.Level != "" && i.Level != d.Level {
		i.Level = d.Level
		hasChanges = true
	}

	if d.Ttl != 0 && i.Ttl != d.Ttl {
		i.Ttl = d.Ttl
		hasChanges = true
	}

	if d.Link != "" && i.Link != d.Link {
		i.Link = d.Link
		hasChanges = true
	}

	if d.Text != "" && i.Text != d.Text {
		i.Text = d.Text
		hasChanges = true
	}

	if d.Tags != nil {
		i.Tags = d.Tags
		hasChanges = true
	}

	if hasChanges {
		i.UpdatedAt = time.Now()
	}

	return i, hasChanges
}

func (im *IndicatorManager) GrabIndicator(code string) *models.Indicator {
	i, ok := im.indicators[code]
	if ok == false {
		i = &models.Indicator{
			Code:      code,
			UpdatedAt: time.Now(),
		}

		im.indicators[code] = i
	}

	return i
}

func (im *IndicatorManager) Persist(i models.Indicator) {
	im.indicators[i.Code] = &i
}

func (im *IndicatorManager) Remove(code string) {
	delete(im.indicators, code)
}

func (im *IndicatorManager) ClearAll() {
	im.indicators = make(map[string]*models.Indicator)
}

func (im *IndicatorManager) Find() iter.Seq[*models.Indicator] {
	return func(yield func(*models.Indicator) bool) {
		for _, indicator := range im.indicators {
			if !yield(indicator) {
				return
			}
		}
	}
}

func IM() *IndicatorManager {
	if im != nil {
		return im
	}

	indicators := make(map[string]*models.Indicator)
	im = &IndicatorManager{
		indicators: indicators,
	}
	return im
}
