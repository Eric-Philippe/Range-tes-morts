package config

import (
	"os"
)

var JWTSecret = []byte(os.Getenv("JWT_SECRET_KEY"))
var PASSWORD = os.Getenv("PASSWORD")
var USERS = os.Getenv("USERS")
