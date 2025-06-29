package service

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func GetResourceHash(url string) string {
	vr, err := http.Get(url)
	if err != nil {
		return ""
	}

	defer vr.Body.Close()
	body, _ := io.ReadAll(vr.Body)
	hasher := md5.New()
	hasher.Write(body)
	md5Sum := hasher.Sum(nil)
	return hex.EncodeToString(md5Sum)
}

func GetResourceStatusOk(url string) int {
	vr, err := http.Get(url)
	if err != nil {
		return 0
	}

	return vr.StatusCode
}

type QueueInfo struct {
	Name     string `json:"name"`     // Имя очереди
	VHost    string `json:"vhost"`    // Виртуальный хост
	Messages int    `json:"messages"` // Общее количество сообщений
}

func GetRabbitMQQueues(dsn string) ([]QueueInfo, error) {
	req, err := http.NewRequest("GET", dsn, nil)
	if err != nil {
		return nil, err
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API вернуло статус %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var queues []QueueInfo
	err = json.Unmarshal(body, &queues)
	if err != nil {
		return nil, err
	}

	return queues, nil
}
