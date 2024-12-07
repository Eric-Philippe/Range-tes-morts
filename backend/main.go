package main

import (
	"backend/database"
	"backend/handlers"
	"backend/helpers"
	"backend/middleware"
	"backend/models"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

const port = 3000

// Main function
// If the file is run directly, the server is started
// If there is a -migrate flag, the SVG file is parsed and the data is inserted into the database
func main() {
    initEnv()

    // Get the command line arguments
    args := os.Args

    // If there is a -migrate flag, parse the SVG file and insert the data into the database
    if len(args) > 1 && args[1] == "--migrate" {
        helpers.MigrateSvgToDb("static/gravemap.svg")
    // If there is a -backup flag, generate an Excel file with the data from the database
    } else if len(args) > 1 && args[1] == "--excel" {
        helpers.GenerateExcelReport("gen/backup.xlsx", "Cimetière", true)
    // If --newuser -p <password> -u <username> is passed, create a new user
    } else if len(args) > 1 && args[1] == "--newuser" {
        helpers.CreateNewUser(args)
    // If --deleteuser -u <username> is passed, delete a user
    } else if len(args) > 1 && args[1] == "--deleteuser" {
        helpers.DeleteUser(args[2])
    // If --listusers is passed, list all the users
    } else if len(args) > 1 && args[1] == "--listusers" {
        helpers.ListUsernames()
    } else {
        // Start the server
        serve()
    }

}

func initEnv() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    database.Init()
    database.DB.AutoMigrate(&models.Grave{}, &models.Dead{}, &models.Lot{}, &models.User{})
}

func serve() {
    // Configure the router
    r := mux.NewRouter()
    r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Range tes morts"))
    })

    r.HandleFunc("/login", handlers.Login).Methods("POST")

    api := r.PathPrefix("/api").Subrouter()
    api.Use(middleware.TokenAuthMiddleware)

    // r.HandleFunc("/lots", handlers.CreateLot).Methods("POST")
    // r.HandleFunc("/graves", handlers.CreateGrave).Methods("POST")

    api.HandleFunc("/lots", handlers.GetLots).Methods("GET") // In active use
    api.HandleFunc("/lots/{id}", handlers.GetLot).Methods("GET")

    api.HandleFunc("/graves", handlers.GetGraves).Methods("GET")
    api.HandleFunc("/graves/{id}", handlers.GetGrave).Methods("GET")
    api.HandleFunc("/graves", handlers.UpdateGrave).Methods("PUT") // In active use
    api.HandleFunc("/graves/{id}/state", handlers.UpdateGraveState).Methods("PUT") 

    api.HandleFunc("/deads", handlers.GetDeads).Methods("GET")
    api.HandleFunc("/deads/{id}", handlers.GetDead).Methods("GET")
    api.HandleFunc("/deads", handlers.UpdateDeads).Methods("PUT") // In active use
    api.HandleFunc("/deads", handlers.DeleteDeads).Methods("DELETE") // In active use

    api.HandleFunc("/backup/xlsx", handlers.GetExcelBackup).Methods("GET")
    api.HandleFunc("/backup/map", handlers.GetGraveryMap).Methods("GET")

    api.HandleFunc("/user", handlers.IsLoggedIn).Methods("GET")


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