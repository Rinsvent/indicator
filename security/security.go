package security

import (
	"errors"
	"net/http"
	"regexp"
)

var (
	ErrorUserNotFount  = errors.New("user not found")
	ErrorPasswordWrong = errors.New("password wrong")
)

func CheckFirewalls(r *http.Request) (*ConfigFirewall, UserInterface, error) {
	firewall := FindFirewall(r)

	// If configuration has no firewall, then skip check. It`s ok!
	if firewall == nil {
		return nil, nil, nil
	}

	// if firewall security = false, then skip load user errors
	token, grabTokenErr := GrabToken(r, *firewall)
	if firewall.Security && grabTokenErr != nil {
		return firewall, nil, grabTokenErr
	}

	if token != nil {
		user, loadUserErr := LoadUser(*token, *firewall)
		if firewall.Security && loadUserErr != nil {
			return firewall, user, loadUserErr
		}

		// Добавить проверку сессии. Если сессия есть, то пароль не проверяем.
		if user != nil && !CheckPassword(firewall.GetConfigStorage().PasswordHasher, user.GetPassword(), token.Password) {
			return firewall, nil, ErrorPasswordWrong
		}

		return firewall, user, nil
	}

	return firewall, nil, nil
}

func FindFirewall(r *http.Request) *ConfigFirewall {
	config := ConfigInstance()
	for _, firewall := range config.Firewalls {
		if firewall.Pattern != "" {
			if matched, _ := regexp.MatchString(firewall.Pattern, r.URL.Path); matched {
				return &firewall
			}
		}
	}
	return nil
}

func GrabToken(r *http.Request, firewall ConfigFirewall) (*Token, error) {
	config := ConfigInstance()
	parentFirewall, hasParentFirewall := config.Firewalls[firewall.Firewall]

	authenticatorCode := firewall.Authenticator
	if hasParentFirewall && authenticatorCode == "" {
		authenticatorCode = parentFirewall.Authenticator
	}

	authenticatorConfig, ok := config.Authenticators[authenticatorCode]
	if !ok {
		panic("authenticator config not found")
	}

	authenticator := FindAuthenticator(authenticatorConfig.Type)
	if authenticator == nil {
		panic("authenticator not found")
	}

	token, err := authenticator(r)
	if err != nil {
		return nil, err
	}

	return token, nil
}

func LoadUser(token Token, firewall ConfigFirewall) (UserInterface, error) {
	config := ConfigInstance()
	parentFirewall, hasParentFirewall := config.Firewalls[firewall.Firewall]

	storageCode := firewall.Storage
	if hasParentFirewall && storageCode == "" {
		storageCode = parentFirewall.Storage
	}

	storage := GrabStorage(storageCode)
	if storage == nil {
		panic("storage not found")
	}

	user, err := storage.Find(token.Id)
	if err != nil {
		return nil, err
	}

	return user, nil
}
