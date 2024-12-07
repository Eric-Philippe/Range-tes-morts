package handlers

import (
	"backend/database"
	"backend/helpers"
	"backend/models"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func Login(w http.ResponseWriter, r *http.Request) {
    // Get the { username, password } from the request body
    var user models.User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Check if the user exists
    var dbUser models.User
    if result := database.DB.Where("username = ?", user.Username).First(&dbUser); result.Error != nil {
        http.Error(w, "Invalid username", http.StatusUnauthorized)
        return
    }

    // Check if the password is correct
    if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); err != nil {
        http.Error(w, "Invalid password", http.StatusUnauthorized)
        return
    }

    token, err := helpers.GenerateJWT(dbUser.Username)
    if err != nil {
        http.Error(w, "Unable to generate token", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(`{"token":"` + token + `"}`))
}