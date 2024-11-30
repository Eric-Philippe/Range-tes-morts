package models

// GraveState represents the current state of a grave either in its availability or its duration
type GraveState int

const (
    EMPTY GraveState = iota // 0
    RESERVED                // 1
    PERPETUAL               // 2
    FIFTEEN                 // 3
    THIRTY                  // 4
    FIFTY                   // 5
)

// String returns the string representation of a GraveState
func (s GraveState) String() string {
    switch s {
    case EMPTY:
        return "EMPTY"
    case RESERVED:
        return "RESERVED"
    case PERPETUAL:
        return "PERPETUAL"
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

// Grave represents a grave in a lot and can contain multiple deads
type Grave struct {
    ID     string       `json:"id" gorm:"primaryKey"`
    Identifier string  `json:"Identifier" gorm:"type:varchar(3)"` 
    State  GraveState `json:"state"`
    LotID  uint       `json:"lot_id"`
    Deads  []Dead     `json:"deads,omitempty"`
}