package models

import (
	"encoding/json"
	"strconv"
	"time"
)

type Level string

const (
	SuccessLevel  Level = "success"
	WarningLevel  Level = "warning"
	ErrorLevel    Level = "error"
	CriticalLevel Level = "critical"
)

type Indicator struct {
	Code      string
	Level     Level
	Ttl       int
	Link      string
	Text      string
	Tags      []string
	UpdatedAt time.Time
}

func (i *Indicator) ToMap() (map[string]string, error) {
	tagsData, err := json.Marshal(i.Tags)
	if err != nil {
		return nil, err
	}

	return map[string]string{
		"Code":      i.Code,
		"Level":     string(i.Level),
		"Ttl":       strconv.Itoa(i.Ttl),
		"Link":      i.Link,
		"Text":      i.Text,
		"Tags":      string(tagsData),
		"UpdatedAt": strconv.FormatInt(i.UpdatedAt.UnixNano(), 10),
	}, nil
}

func MapToIndicator(data map[string]string) (*Indicator, error) {
	ttl, err := strconv.Atoi(data["Ttl"])
	if err != nil {
		return nil, err
	}

	updatedAtNano, err := strconv.ParseInt(data["UpdatedAt"], 10, 64)
	if err != nil {
		return nil, err
	}

	var tags []string
	if err := json.Unmarshal([]byte(data["Tags"]), &tags); err != nil {
		return nil, err
	}

	return &Indicator{
		Code:      data["Code"],
		Level:     Level(data["Level"]),
		Ttl:       ttl,
		Link:      data["Link"],
		Text:      data["Text"],
		Tags:      tags,
		UpdatedAt: time.Unix(0, updatedAtNano),
	}, nil
}
