package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/models"

	"github.com/gorilla/mux"
)

// CreateDeadForGrave creates a new dead for a grave
func CreateDeadForGrave(w http.ResponseWriter, r *http.Request) {
    var dead models.Dead
    var requestData struct {
        FirstName string `json:"firstname"`
        LastName  string `json:"lastname"`
        EntryDate string `json:"entrydate"`
        State     int    `json:"state"`
    }

    // curl -X POST http://localhost:3000/lots/{lotId}/graves/{graveId}/deads -H "Content-Type: application/json" -d '{
    // "firstname": "John",
    // "lastname": "Doe",
    //  "entrydate": "2023-10-01",
    //  "state": 1
    // }'

    if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    dead.FirstName = requestData.FirstName
    dead.LastName = requestData.LastName
    dead.EntryDate = requestData.EntryDate

    var graveId = mux.Vars(r)["graveId"]
    var lotId = mux.Vars(r)["lotId"]
    dead.GraveID = lotId + "#" + graveId

    var grave models.Grave
    if result := database.DB.Where("id = ?", dead.GraveID).First(&grave); result.Error != nil {
        http.Error(w, "Grave not found", http.StatusNotFound)
        return
    }

    // Update the state of the grave
    grave.State = models.GraveState(requestData.State)
    if result := database.DB.Save(&grave); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    // Create the dead
    if result := database.DB.Create(&dead); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(dead)
}

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