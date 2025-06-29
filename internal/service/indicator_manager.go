package service

import (
	"fmt"
	"git.rinsvent.ru/rinsvent/indicator/internal/models"
	"git.rinsvent.ru/rinsvent/indicator/internal/request"
	"iter"
	"net/http"
	"strconv"
	"strings"
	"time"
)

var im *IndicatorManager

type IndicatorManager struct {
	indicators map[string]*models.Indicator
}

func (im *IndicatorManager) SetUp() {
	data, err := GetAllObjects()
	if err != nil {
		panic(err)
	}

	for _, obj := range data {
		i, err := models.MapToIndicator(obj)
		if err != nil {
			fmt.Println(err)
			continue
		}
		im.indicators[i.Code] = i
	}
}

func (im *IndicatorManager) Upsert(code string, d request.UpsertIndicatorBody) (*models.Indicator, bool) {
	i := im.GrabIndicator(code)

	hasChanges := false
	if d.Type != "" && i.Type != d.Type {
		i.Type = d.Type
		hasChanges = true
	}

	if d.Level != "" && i.Level != d.Level {
		i.Level = d.Level
		hasChanges = true
	}

	if d.Settings != nil && string(i.Settings) != string(d.Settings) {
		i.Settings = d.Settings
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

	i.PingAt = time.Now()
	if hasChanges {
		i.RevisionAt = time.Now()
	}

	tmp, _ := i.ToMap()
	_ = UpsertObject(i.Code, tmp)

	return i, hasChanges
}

func (im *IndicatorManager) GrabIndicator(code string) *models.Indicator {
	i, ok := im.indicators[code]
	if ok == false {
		i = &models.Indicator{
			Code:       code,
			RevisionAt: time.Now(),
		}

		im.indicators[code] = i
	}

	return i
}

func (im *IndicatorManager) Persist(i models.Indicator) {
	im.indicators[i.Code] = &i

	tmp, _ := i.ToMap()
	_ = UpsertObject(i.Code, tmp)
}

func (im *IndicatorManager) Remove(code string) {
	i, ok := im.indicators[code]
	if ok == false {
		return
	}

	_ = DeleteObject(i.Code)
	delete(im.indicators, code)
}

func (im *IndicatorManager) ClearAll() {
	im.indicators = make(map[string]*models.Indicator)
	_, _ = ClearAllObjects()
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

func (im *IndicatorManager) Check() {
	for _, indicator := range im.indicators {
		switch indicator.Type {
		case models.TypeResourceHash:
			resource := indicator.GetResource()
			if time.Now().Unix()-indicator.PingAt.Unix() <= int64(resource.RequestInterval) {
				continue
			}

			actualHash := GetResourceHash(resource.Url)
			if resource.Hash == actualHash {
				im.Upsert(indicator.Code, request.UpsertIndicatorBody{
					Level: models.SuccessLevel,
					Text:  "Last hash: " + actualHash,
				})
			} else {
				im.Upsert(indicator.Code, request.UpsertIndicatorBody{
					Level: resource.Level,
					Text:  "Last hash: " + actualHash,
				})
			}
			break
		case models.TypeResourceStatusOk:
			resource := indicator.GetResource()
			if time.Now().Unix()-indicator.PingAt.Unix() <= int64(resource.RequestInterval) {
				continue
			}
			status := GetResourceStatusOk(resource.Url)
			if status == http.StatusOK {
				im.Upsert(indicator.Code, request.UpsertIndicatorBody{
					Level: models.SuccessLevel,
					Text:  "Last status: 200",
				})
			} else {
				im.Upsert(indicator.Code, request.UpsertIndicatorBody{
					Level: resource.Level,
					Text:  "Last status: " + strconv.Itoa(status),
				})
			}
			break
		case models.TypeRabbitMQCount:
			resource := indicator.GetRabbitMqCount()
			if time.Now().Unix()-indicator.PingAt.Unix() <= int64(resource.RequestInterval) {
				continue
			}
			queues, err := GetRabbitMQQueues(resource.Dsn)
			if err != nil {
				im.Upsert(indicator.Code, request.UpsertIndicatorBody{
					Level: models.CriticalLevel,
					Text:  "Rabbitmq api is not available: " + err.Error(),
				})
				continue
			}

			levelsCounts := strings.Split(resource.Counts, ",")
			maxCount := 0
			text := ""

			for _, q := range queues {
				currentLevel := grabRabbitmqLevel(levelsCounts, q.Messages)
				if currentLevel == "" {
					continue
				}
				text = text + fmt.Sprintf("- [%s] %s: %d\n", q.VHost, q.Name, q.Messages)
				maxCount = max(maxCount, q.Messages)
			}

			if text == "" {
				im.Upsert(indicator.Code, request.UpsertIndicatorBody{
					Level: models.SuccessLevel,
					Text:  text,
				})
			} else {
				im.Upsert(indicator.Code, request.UpsertIndicatorBody{
					Level: grabRabbitmqLevel(levelsCounts, maxCount),
					Text:  text,
				})
			}

			break
		}
	}
}

func grabRabbitmqLevel(levelsCounts []string, count int) models.Level {
	for i, levelsCount := range levelsCounts {
		levelsCountNumber, _ := strconv.Atoi(levelsCount)
		if levelsCountNumber > count {
			continue
		}

		switch i {
		case 0:
			return models.WarningLevel
		case 1:
			return models.ErrorLevel
		case 2:
			return models.CriticalLevel
		}
	}
	return ""
}

func IM() *IndicatorManager {
	if im != nil {
		return im
	}

	indicators := make(map[string]*models.Indicator)
	im = &IndicatorManager{
		indicators: indicators,
	}

	im.SetUp()

	return im
}
