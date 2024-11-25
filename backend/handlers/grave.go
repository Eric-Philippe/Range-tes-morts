package handlers

import (
    "encoding/json"
    "net/http"

    "backend/database"
    "backend/models"
    "github.com/gorilla/mux"
)

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

func GetGraves(w http.ResponseWriter, r *http.Request) {
    var graves []models.Grave
    if result := database.DB.Find(&graves); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(graves)
}

func GetGrave(w http.ResponseWriter, r *http.Request) {
    var grave models.Grave
    if result := database.DB.First(&grave, mux.Vars(r)["id"]).Error; result.Error != nil {
        http.Error(w, result.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(grave)
}

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