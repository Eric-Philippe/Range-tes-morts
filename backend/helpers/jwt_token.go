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

func IsLoggedIn(tokenString string) bool {
	// Check that the token is valid and not expired
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return false
	}
	return token.Valid
}