package helpers

import (
	"backend/database"
	"backend/models"
	"log"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func CreateAllUsers() {
	// Delete all users
	database.DB.Exec("DELETE FROM users")

	usernames := os.Getenv("USERS")
	password := os.Getenv("PASSWORD")

	// Split the usernames string into an array
	userNames := strings.Split(usernames, ",")
	for _, username := range userNames {
		hash, err := generateHash(password)
		if err != nil {
			log.Fatal("Error generating hash")
		}

		user := models.User{Username: username, Password: hash}
		database.DB.Create(&user)
	}
}

func CreateNewUser(args []string) {
	if len(args) < 6 {
		log.Fatal("Usage: go run main.go --newuser -u <username> -p <password>")
	}

	username := args[3]
	password := args[5]

	hash, err := generateHash(password)
	if err != nil {
		log.Fatal("Error generating hash")
	}

	user := models.User{Username: username, Password: hash}
	database.DB.Create(&user)

	log.Println("User created")
}

func DeleteUser(username string) {
	var user models.User
	if result := database.DB.Where("username = ?", username).First(&user); result.Error != nil {
		log.Fatal("User not found")
	}

	database.DB.Delete(&user)

	log.Println("User deleted")
}

func ListUsernames() {
	var users []models.User
	database.DB.Find(&users)

	log.Println("Users:")
	log.Println("------")

	if len(users) == 0 {
		log.Println("No users found")
	}

	for _, user := range users {
		log.Println(user.Username)
	}

	log.Println("------")
}

func CountUsers() int {
	var users []models.User
	database.DB.Find(&users)

	return len(users)
}

func generateHash(password string) (string, error) {
    hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return "", err
    }
    return string(hash), nil
}