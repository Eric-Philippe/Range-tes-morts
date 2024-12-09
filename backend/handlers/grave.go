package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/models"

	"github.com/gorilla/mux"
)

// CreateGrave creates a new grave
func CreateGrave(w http.ResponseWriter, r *http.Request) {
    var grave models.Grave
    if err := json.NewDecoder(r.Body).Decode(&grave); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if result := database.DB.Create(&grave); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(grave)
}

// GetGrave returns a grave /grave
func GetGrave(w http.ResponseWriter, r *http.Request) {
    // Define a struct to hold the request body
    var requestBody struct {
        ID string `json:"id"`
    }

    // Decode the request body
    if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Get the id from the request body
    id := requestBody.ID

    // Get the grave from the database
    var grave models.Grave
    if result := database.DB.Preload("Deads").First(&grave, id); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusNotFound)
        return
    }

    json.NewEncoder(w).Encode(grave)
}

// GetGraves returns all graves
func GetGraves(w http.ResponseWriter, r *http.Request) {
    var graves []models.Grave
    if result := database.DB.Find(&graves); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(graves)
}

// UpdateGraveState updates the state of a grave
func UpdateGraveState(w http.ResponseWriter, r *http.Request) {
    var grave models.Grave
    if err := database.DB.First(&grave, mux.Vars(r)["id"]).Error; err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }

    var newState struct {
        State models.GraveState `json:"state"`
    }
    if err := json.NewDecoder(r.Body).Decode(&newState); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    grave.State = newState.State
    if err := database.DB.Save(&grave).Error; err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(grave)
}

func UpdateGrave(w http.ResponseWriter, r *http.Request) {
    var newGrave models.Grave
    if err := json.NewDecoder(r.Body).Decode(&newGrave); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    var grave models.Grave
    if err := database.DB.Where("id = ?", newGrave.ID).First(&grave).Error; err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }

    // Update the grave details
    grave.Identifier = newGrave.Identifier
    grave.State = newGrave.State
    grave.LotID = newGrave.LotID

    // Update the deads in the grave
    for _, newDead := range newGrave.Deads {
        var dead models.Dead
        if err := database.DB.Where("id = ?", newDead.ID).First(&dead).Error; err != nil {
            // If the dead does not exist, create a new one
            newDead.GraveID = grave.ID
            if err := database.DB.Create(&newDead).Error; err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        } else {
            // If the dead exists, update its details
            dead.FirstName = newDead.FirstName
            dead.LastName = newDead.LastName
            dead.EntryDate = newDead.EntryDate
            dead.GraveID = grave.ID
            if err := database.DB.Save(&dead).Error; err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }
    }

    if err := database.DB.Save(&grave).Error; err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(grave)
}