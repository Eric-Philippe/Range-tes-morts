package main

import (
	"backend/database"
	"backend/handlers"
	"backend/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

const port = 3000

func main() {
    // Initialize the database
    database.Init()
    database.DB.AutoMigrate(&models.Grave{}, &models.Dead{}, &models.Lot{})

    // Configure the router
    r := mux.NewRouter()
    r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Range tes morts"))
    })

    r.HandleFunc("/lot", handlers.CreateLot).Methods("POST")
    r.HandleFunc("/grave", handlers.CreateGrave).Methods("POST")

    r.HandleFunc("/graves", handlers.GetGraves).Methods("GET")
    r.HandleFunc("/deads", handlers.GetDeads).Methods("GET")
    r.HandleFunc("/lots", handlers.GetLots).Methods("GET")
    r.HandleFunc("/graves/{id}", handlers.GetGrave).Methods("GET")
    r.HandleFunc("/deads/{id}", handlers.GetDead).Methods("GET")
    r.HandleFunc("/lots/{id}", handlers.GetLot).Methods("GET")

    r.HandleFunc("/graves/{id}/deads", handlers.CreateDeadForGrave).Methods("POST")
    r.HandleFunc("/graves/{id}/state", handlers.UpdateGraveState).Methods("PUT")

    // Display a message when the server is started
    log.Println("Le serveur est démarré sur le port", port)

    // Start the server
    log.Fatal(http.ListenAndServe(":" + strconv.Itoa(port), r))
}