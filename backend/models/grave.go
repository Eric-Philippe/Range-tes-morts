package models

type GraveState int

const (
    EMPTY GraveState = iota
    RESERVED
    PERPETUEL
    FIFTEEN
    THIRTY
    FIFTY
)

func (s GraveState) String() string {
    switch s {
    case EMPTY:
        return "EMPTY"
    case RESERVED:
        return "RESERVED"
    case PERPETUEL:
        return "PERPETUEL"
    case FIFTEEN:
        return "FIFTEEN"
    case THIRTY:
        return "THIRTY"
    case FIFTY:
        return "FIFTY"
    default:
        return "UNKNOWN"
    }
}

type Grave struct {
    ID     uint       `json:"id" gorm:"primaryKey"`
    State  GraveState `json:"state"`
    LotID  uint       `json:"lot_id"`
    Deads  []Dead     `json:"deads,omitempty"`
}