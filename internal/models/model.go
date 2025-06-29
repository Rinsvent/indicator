package models

import (
	"encoding/json"
	"strconv"
	"time"
)

type Type string
type Level string

const (
	TyperApi             Type = "api"                // Full api control
	TypePing             Type = "ping"               // Only expected code field for update pingAt
	TypeResourceHash     Type = "resource_hash"      // Alert when resource hash was changed
	TypeResourceStatusOk Type = "resource_status_ok" // Alert when resource http status was not 200
	TypeRabbitMQCount    Type = "rabbitmq_count"     // Alert when queue messages greater than config counts

	SuccessLevel  Level = "success"
	WarningLevel  Level = "warning"
	ErrorLevel    Level = "error"
	CriticalLevel Level = "critical"
)

type Indicator struct {
	Code       string          `json:"code"`
	Type       Type            `json:"type"`
	Level      Level           `json:"level"`
	Settings   json.RawMessage `json:"settings"`
	Ttl        int             `json:"ttl"`
	Link       string          `json:"link"`
	Text       string          `json:"text"`
	Tags       []string        `json:"tags"`
	RevisionAt time.Time       `json:"revisionAt"`
	PingAt     time.Time       `json:"pingAt"`
}

type Resource struct {
	Url             string `json:"url"`
	Level           Level  `json:"level"`
	RequestInterval int    `json:"requestInterval"`
	Hash            string `json:"hash"`
}

func (i *Indicator) GetResource() *Resource {
	if i.Type != TypeResourceHash && i.Type != TypeResourceStatusOk {
		return nil
	}

	var s Resource
	if err := json.Unmarshal(i.Settings, &s); err != nil {
		return nil
	}
	return &s
}

type Ping struct {
	Level           Level `json:"level"`
	RequestInterval int   `json:"requestInterval"`
}

func (i *Indicator) GetPing() *Ping {
	if i.Type != TypePing {
		return nil
	}

	var s Ping
	if err := json.Unmarshal(i.Settings, &s); err != nil {
		return nil
	}
	return &s
}

type RabbitMqCount struct {
	Dsn             string `json:"dsn"`
	Counts          string `json:"counts"` // comma separated int values. 20,40,50 -> success , warning (> 20), error (> 40), critical (> 50). For 20,40 example critical alert not triggered
	RequestInterval int    `json:"requestInterval"`
}

func (i *Indicator) GetRabbitMqCount() *RabbitMqCount {
	if i.Type != TypeRabbitMQCount {
		return nil
	}

	var s RabbitMqCount
	if err := json.Unmarshal(i.Settings, &s); err != nil {
		return nil
	}
	return &s
}

func (i *Indicator) ToMap() (map[string]string, error) {
	tagsData, err := json.Marshal(i.Tags)
	if err != nil {
		return nil, err
	}

	return map[string]string{
		"Code":       i.Code,
		"Type":       string(i.Type),
		"Level":      string(i.Level),
		"Settings":   string(i.Settings),
		"Ttl":        strconv.Itoa(i.Ttl),
		"Link":       i.Link,
		"Text":       i.Text,
		"Tags":       string(tagsData),
		"RevisionAt": strconv.FormatInt(i.RevisionAt.UnixNano(), 10),
		"PingAt":     strconv.FormatInt(i.PingAt.UnixNano(), 10),
	}, nil
}

func MapToIndicator(data map[string]string) (*Indicator, error) {
	ttl, err := strconv.Atoi(data["Ttl"])
	if err != nil {
		return nil, err
	}

	updatedAtNano, err := strconv.ParseInt(data["RevisionAt"], 10, 64)
	if err != nil {
		return nil, err
	}

	pingAtNano, err := strconv.ParseInt(data["PingAt"], 10, 64)
	if err != nil {
		return nil, err
	}

	var tags []string
	if err := json.Unmarshal([]byte(data["Tags"]), &tags); err != nil {
		return nil, err
	}

	return &Indicator{
		Code:       data["Code"],
		Type:       Type(data["Type"]),
		Level:      Level(data["Level"]),
		Settings:   json.RawMessage(data["Settings"]),
		Ttl:        ttl,
		Link:       data["Link"],
		Text:       data["Text"],
		Tags:       tags,
		RevisionAt: time.Unix(0, updatedAtNano),
		PingAt:     time.Unix(0, pingAtNano),
	}, nil
}
