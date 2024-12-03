package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/models"

	"github.com/gorilla/mux"
)

// GetDeads returns all deads
func GetDeads(w http.ResponseWriter, r *http.Request) {
    var deads []models.Dead
    if result := database.DB.Find(&deads); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(deads)
}

// GetDead returns a dead
func GetDead(w http.ResponseWriter, r *http.Request) {
    var dead models.Dead
    if result := database.DB.First(&dead, mux.Vars(r)["id"]).Error; result != nil {
        http.Error(w, result.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(dead)
}

// Function to delete an array of deads
func DeleteDeads(w http.ResponseWriter, r *http.Request) {
    var deads []models.Dead

    if err := json.NewDecoder(r.Body).Decode(&deads); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // We delete each dead
    for _, dead := range deads {
        if result := database.DB.Delete(&dead); result.Error != nil {
            http.Error(w, result.Error.Error(), http.StatusInternalServerError)
            return
        }
    }

    w.WriteHeader(http.StatusNoContent)
}

func UpdateDeads(w http.ResponseWriter, r *http.Request) {
    var deads []models.Dead

    // We receive an array of deads [{id: 1, name: "Jean"}, {id: 2, name: "Paul"}, ...]
    if err := json.NewDecoder(r.Body).Decode(&deads); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // We update each dead
    for _, dead := range deads {
        if result := database.DB.Save(&dead); result.Error != nil {
            http.Error(w, result.Error.Error(), http.StatusInternalServerError)
            return
        }
    }

    w.WriteHeader(http.StatusNoContent)
}