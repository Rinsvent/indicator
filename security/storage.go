package security

type Storage interface {
	Find(id string) (UserInterface, error)
}

type MemoryStorage struct {
	users map[string]ConfigUser
}

func (ms *MemoryStorage) Find(id string) (UserInterface, error) {
	user, ok := ms.users[id]
	if !ok {
		return nil, ErrorUserNotFount
	}
	return NewMemoryUser(id, user.Password), nil
}

func NewMemoryStorage(users map[string]ConfigUser) *MemoryStorage {
	return &MemoryStorage{users: users}
}

var storages = make(map[string]Storage)

func RegisterStorage(code string, storage Storage) {
	_, ok := storages[code]
	if ok {
		panic("storage already registered")
	}
	storages[code] = storage
}

func GrabStorage(code string) Storage {
	if storage, ok := storages[code]; ok {
		return storage
	}

	config := ConfigInstance()
	storageConfig, ok := config.Storages[code]
	if !ok {
		return nil
	}

	switch storageConfig.Type {
	case string(StorageMemory):
		storages[code] = NewMemoryStorage(storageConfig.Users)
	}

	if storage, ok := storages[code]; ok {
		return storage
	}
	return nil
}
