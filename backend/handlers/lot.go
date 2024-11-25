package handlers

import (
    "encoding/json"
    "net/http"

    "backend/database"
    "backend/models"
    "github.com/gorilla/mux"
)

func CreateLot(w http.ResponseWriter, r *http.Request) {
    var lot models.Lot
    if err := json.NewDecoder(r.Body).Decode(&lot); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if result := database.DB.Create(&lot); result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(lot)
}

func GetLots(w http.ResponseWriter, r *http.Request) {
    var lots []models.Lot
    if err := database.DB.Preload("Graves.Deads").Find(&lots).Error; err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(lots)
}

func GetLot(w http.ResponseWriter, r *http.Request) {
    var lot models.Lot
    if err := database.DB.Preload("Graves.Deads").First(&lot, mux.Vars(r)["id"]).Error; err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(lot)
}