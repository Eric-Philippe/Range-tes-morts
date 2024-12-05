package models

import (
	"strconv"
	"time"
)

// Array with all the french months
var months = []string{
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
}

// Dead represents a dead person in a grave
type Dead struct {
    ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
    FirstName string    `json:"firstname"`
    LastName  string    `json:"lastname"`
    EntryDate time.Time `json:"entrydate"`
    GraveID   string    `json:"grave_id"`
}

// Method to convert the EntryDate to a MMMM/YYYY string format (in french)
func (d Dead) EntryDateToString() string {
    return months[d.EntryDate.Month()-1] + " " + strconv.Itoa(d.EntryDate.Year())
}