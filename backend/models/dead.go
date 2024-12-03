package models

import "time"

// Dead represents a dead person in a grave
type Dead struct {
    ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
    FirstName string    `json:"firstname"`
    LastName  string    `json:"lastname"`
    EntryDate time.Time `json:"entrydate"`
    GraveID   string    `json:"grave_id"`
}