package handlers

import (
    "encoding/json"
    "net/http"
    "strconv" // Add this import

    "backend/database"
    "backend/models"
    "github.com/gorilla/mux"
)

func CreateDeadForGrave(w http.ResponseWriter, r *http.Request) {
    var dead models.Dead
    if err := json.NewDecoder(r.Body).Decode(&dead); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    graveID, err := strconv.ParseUint(mux.Vars(r)["id"], 10, 32)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    dead.GraveID = uint(graveID)

    if result := database.DB.Create(&dead); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(dead)
}

func GetDeads(w http.ResponseWriter, r *http.Request) {
    var deads []models.Dead
    if result := database.DB.Find(&deads); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(deads)
}

func GetDead(w http.ResponseWriter, r *http.Request) {
    var dead models.Dead
    if result := database.DB.First(&dead, mux.Vars(r)["id"]).Error; result.Error != nil {
        http.Error(w, result.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(dead)
}