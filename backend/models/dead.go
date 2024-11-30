package models

// Dead represents a dead person in a grave
type Dead struct {
    ID        uint   `json:"id" gorm:"primaryKey"`
    FirstName string `json:"firstname"`
    LastName  string `json:"lastname"`
    EntryDate string `json:"entrydate"`
    GraveID   string   `json:"grave_id"`
}