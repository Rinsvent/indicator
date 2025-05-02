package tests

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func PrettyJson(payload string) string {
	var prettyJSON bytes.Buffer
	err := json.Indent(&prettyJSON, []byte(payload), "", "\t")
	if err != nil {
		return ""
	}
	return string(prettyJSON.Bytes())
}

func AssertFile(t *testing.T, path string, content string, write bool) {
	os.MkdirAll(filepath.Dir(path), os.ModePerm)
	b, _ := os.ReadFile(path)
	if write {
		os.WriteFile(path, []byte(content), 0644)
	}
	if !strings.EqualFold(content, string(b)) {
		t.Fatalf("Unexpected content: %s", content)
	}

	if write {
		t.Fatalf("Should disable writing to file")
	}
}
