package database

import (
	"context"
	"log"
	"os"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const dbDir = "./data"
const dbName = "rangetesmorts.db"
const dbPath = dbDir + "/" + dbName

var DB *gorm.DB

// Init initializes the database connection
func Init() {
	var err error

	// Ensure the directory exists
	if _, err := os.Stat(dbDir); os.IsNotExist(err) {
		if err := os.MkdirAll(dbDir, os.ModePerm); err != nil {
			log.Fatalf("Failed to create directory %s: %v", dbDir, err)
		}
		log.Printf("Created directory: %s", dbDir)
	}

	// Initialize the database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Ping the database to verify connection
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get database instance: ", err)
	}

	if err := sqlDB.PingContext(ctx); err != nil {
		log.Fatal("Failed to ping database: ", err)
	}

	log.Printf("Connected to SQLite database at %s", dbPath)
}