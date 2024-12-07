package helpers

import (
	"backend/config"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtSecret = []byte(config.JWTSecret)

func GenerateJWT(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
