package models

import (
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
