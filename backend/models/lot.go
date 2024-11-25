package models

type Lot struct {
    ID     uint    `json:"id" gorm:"primaryKey"`
    Name   string  `json:"name"`
    Graves []Grave `json:"graves,omitempty"`
}