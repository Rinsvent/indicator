package security

import "golang.org/x/crypto/bcrypt"

func CheckPassword(hasher, hash, password string) bool {
	switch hasher {
	case "bcrypt":
		return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
	}

	return false
}
