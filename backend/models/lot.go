package models

/*
One Lot contains many Graves
*/
type Lot struct {
    ID     uint    `json:"id" gorm:"primaryKey"`
    Name   string  `json:"name"`
    Graves []Grave `json:"graves,omitempty"`
}