package main

import (
	"backend/database"
	"backend/handlers"
	"backend/helpers"
	"backend/models"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

const port = 3000

// Main function
// If the file is run directly, the server is started
// If there is a -migrate flag, the SVG file is parsed and the data is inserted into the database
func main() {
    // Get the command line arguments
    args := os.Args

    // If there is a -migrate flag, parse the SVG file and insert the data into the database
    if len(args) > 1 && args[1] == "-migrate" {
        helpers.MigrateSvgToDb("static/gravemap.svg")
    } else if len(args) > 1 && args[1] == "-excel" {
        helpers.GenerateExcelReport("gen/backup.xlsx", "Cimetière", true)
    } else {
        // Start the server
        serve()
    }

}

func serve() {
    // Initialize the database
    database.Init()
    database.DB.AutoMigrate(&models.Grave{}, &models.Dead{}, &models.Lot{})

    // Configure the router
    r := mux.NewRouter()
    r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Range tes morts"))
    })

    // r.HandleFunc("/lots", handlers.CreateLot).Methods("POST")
    // r.HandleFunc("/graves", handlers.CreateGrave).Methods("POST")

    r.HandleFunc("/lots", handlers.GetLots).Methods("GET") // In active use
    r.HandleFunc("/lots/{id}", handlers.GetLot).Methods("GET")

    r.HandleFunc("/graves", handlers.GetGraves).Methods("GET")
    r.HandleFunc("/graves/{id}", handlers.GetGrave).Methods("GET")
    r.HandleFunc("/graves", handlers.UpdateGrave).Methods("PUT") // In active use
    r.HandleFunc("/graves/{id}/state", handlers.UpdateGraveState).Methods("PUT") 

    r.HandleFunc("/deads", handlers.GetDeads).Methods("GET")
    r.HandleFunc("/deads/{id}", handlers.GetDead).Methods("GET")
    r.HandleFunc("/deads", handlers.UpdateDeads).Methods("PUT") // In active use
    r.HandleFunc("/deads", handlers.DeleteDeads).Methods("DELETE") // In active use


    // Enable CORS
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"*"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders:   []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
    })

    // Display a message when the server is started
    log.Println("Server started on port", port)

    // Start the server
    log.Fatal(http.ListenAndServe(":" + strconv.Itoa(port), c.Handler(r)))
}