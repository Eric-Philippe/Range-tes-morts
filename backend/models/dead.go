package models

// Dead represents a dead person in a grave
type Dead struct {
    ID        uint   `json:"id" gorm:"primaryKey"`
    FirstName string `json:"first_name"`
    LastName  string `json:"last_name"`
    EntryDate string `json:"entry_date"`
    GraveID   uint   `json:"grave_id"`
}