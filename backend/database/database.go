package database

import (
	"context"
	"log"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const dbName = "rangetesmorts.db"

var DB *gorm.DB

// Init initializes the database connection
func Init() {
    var err error
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    DB, err = gorm.Open(sqlite.Open(dbName), &gorm.Config{})
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

    log.Println("Connected to SQLite database")
}