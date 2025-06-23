package security

type Token struct {
	Id       string
	Password string
}

type UserInterface interface {
	GetId() string
	GetPassword() string
}

type MemoryUser struct {
	id       string
	password string
}

func (mu *MemoryUser) GetId() string {
	return mu.id
}

func (mu *MemoryUser) GetPassword() string {
	return mu.password
}

func NewMemoryUser(id string, password string) *MemoryUser {
	return &MemoryUser{id: id, password: password}
}
