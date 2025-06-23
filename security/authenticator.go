package security

import (
	"errors"
	"net/http"
)

var (
	ErrorTokenRequired = errors.New("token is required")
)

type Authenticator func(*http.Request) (*Token, error)

var authenticators = map[string]Authenticator{
	"http_basic": func(r *http.Request) (*Token, error) {
		username, password, ok := r.BasicAuth()
		if !ok {
			return nil, ErrorTokenRequired
		}
		return &Token{username, password}, nil
	},
}

func RegisterAuthenticator(code string, authenticator Authenticator) {
	_, ok := authenticators[code]
	if ok {
		panic("authenticator already registered")
	}
	authenticators[code] = authenticator
}

func FindAuthenticator(code string) Authenticator {
	authenticator, ok := authenticators[code]
	if !ok {
		return nil
	}
	return authenticator
}
