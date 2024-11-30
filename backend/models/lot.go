package models

type Lot struct {
    ID     uint   `json:"id" gorm:"primaryKey"`
    Name   string `json:"name" gorm:"type:varchar(100)"`
    Graves []Grave `json:"graves" gorm:"foreignKey:LotID"`
}