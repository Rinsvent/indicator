package security

import (
	"bytes"
	"gopkg.in/yaml.v3"
	"os"
	"path/filepath"
)

var confData *Config = nil

type StorageEnum string
type AuthenticatorEnum string

const (
	StorageMemory          StorageEnum       = "memory"
	AuthenticatorHttpBasic AuthenticatorEnum = "http_basic"
)

type ConfigSession struct {
	Handler        string `yaml:"handler"`
	CookieName     string `yaml:"cookie_name"`
	CookieSecure   string `yaml:"cookie_secure"`
	CookieSameSite string `yaml:"cookie_samesite"`
}

type ConfigStorage struct {
	Type           string                `yaml:"type"`
	PasswordHasher string                `yaml:"password_hasher"`
	Users          map[string]ConfigUser `yaml:"users"`
}

type ConfigAuthenticator struct {
	Type      string    `yaml:"type"`
	HttpBasic HttpBasic `yaml:"http_basic"`
}

type ConfigUser struct {
	Password string `yaml:"password"`
}

type HttpBasic struct {
	Realm string `yaml:"realm"`
}

type ConfigFirewall struct {
	Pattern       string `yaml:"pattern"`
	Firewall      string `yaml:"firewall"`
	Authenticator string `yaml:"authenticator"`
	Security      bool   `yaml:"security"`
	Storage       string `yaml:"storage"`
}

func (cf *ConfigFirewall) GetConfigAuthenticator() ConfigAuthenticator {
	config := ConfigInstance()
	parentFirewall, hasParentFirewall := config.Firewalls[cf.Firewall]

	authenticatorCode := cf.Authenticator
	if hasParentFirewall && authenticatorCode == "" {
		authenticatorCode = parentFirewall.Authenticator
	}

	authenticatorConfig, ok := config.Authenticators[authenticatorCode]
	if !ok {
		panic("authenticator config not found")
	}
	return authenticatorConfig
}

func (cf *ConfigFirewall) GetConfigStorage() ConfigStorage {
	config := ConfigInstance()
	parentFirewall, hasParentFirewall := config.Firewalls[cf.Firewall]

	storageCode := cf.Storage
	if hasParentFirewall && storageCode == "" {
		storageCode = parentFirewall.Storage
	}

	storageConfig, ok := config.Storages[storageCode]
	if !ok {
		panic("storage config not found")
	}
	return storageConfig
}

func (cf *ConfigFirewall) UnmarshalYAML(unmarshal func(interface{}) error) error {
	type rawConfig ConfigFirewall

	temp := rawConfig{
		Security: true,
	}

	if err := unmarshal(&temp); err != nil {
		return err
	}

	*cf = ConfigFirewall(temp)
	return nil
}

type Config struct {
	Session        ConfigSession                  `yaml:"session"`
	Storages       map[string]ConfigStorage       `yaml:"storages"`
	Authenticators map[string]ConfigAuthenticator `yaml:"authenticators"`
	Firewalls      map[string]ConfigFirewall      `yaml:"firewalls"`
}

func ConfigInstance() *Config {
	if confData != nil {
		return confData
	}

	confData = &Config{}
	configPath := filepath.Join(filepath.Dir("./"), "config/security.yml")
	file, err := readFile(configPath)

	if err != nil {
		panic(err)
	}
	if err := yaml.Unmarshal(file, confData); err != nil {
		panic(err)
	}

	return confData
}

func readFile(filePath string) ([]byte, error) {
	path, err := filepath.EvalSymlinks(filePath)
	if err != nil {
		return nil, err
	}
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	buffer := new(bytes.Buffer)
	if _, err = buffer.ReadFrom(file); err != nil {
		return nil, err
	}
	return buffer.Bytes(), nil
}
