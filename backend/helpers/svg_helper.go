package helpers

import (
	"backend/database"
	"backend/models"
	"encoding/xml"
	"fmt"
	"os"
	"strings"
)

// SVGHelper is a structure to help parse SVG files.
type SVGHelper struct {
	FilePath string
}

// SVGElement represents an element in an SVG file.
type SVGElement struct {
	XMLName  xml.Name
	Attr     []xml.Attr    `xml:",any,attr"`
	Children []SVGElement  `xml:",any"`
}

// NewSVGHelper return a new SVGHelper instance.
func NewSVGHelper(filePath string) *SVGHelper {
	return &SVGHelper{FilePath: filePath}
}

// ParseSVG analyze the SVG file and return the lots and graves.
func (h *SVGHelper) ParseSVG() ([]models.Lot, error) {
	// Read the SVG file
	data, err := os.ReadFile(h.FilePath)
	if err != nil {
		return nil, fmt.Errorf("error while reading the SVG file : %w", err)
	}

	// Unmarshal the SVG data
	var root SVGElement
	if err := xml.Unmarshal(data, &root); err != nil {
		return nil, fmt.Errorf("error while unmarshalling the SVG data : %w", err)
	}

	var lots []models.Lot
	lotID := uint(1)

	// Search the group with the id "Graveyard"
	for _, group := range root.Children {
		if group.XMLName.Local == "g" && getAttr(group.Attr, "id") == "Graveyard" {
			// Parcourir les sous-groupes (les sous-lots)
			for _, subGroup := range group.Children {
				if subGroup.XMLName.Local == "g" {
					subLotName := getAttr(subGroup.Attr, "id")
					if subLotName == "" {
						continue
					}

					var graves []models.Grave
					graveID := uint(1)
					for _, element := range subGroup.Children {
						// Exclure les éléments contenant "PATH"
						if element.XMLName.Local == "rect" && !strings.Contains(getAttr(element.Attr, "id"), "PATH") {
							graveIdentifier := strings.TrimPrefix(getAttr(element.Attr, "id"), subLotName+"#")
							graves = append(graves, models.Grave{
								ID: subLotName + "$" + graveIdentifier,
								Identifier: graveIdentifier,
								State:      0,
								LotID:      lotID,
							})
							graveID++
						}
					}

					lots = append(lots, models.Lot{
						ID:     lotID,
						Name:   subLotName,
						Graves: graves,
					})
					lotID++
				}
			}
		}
	}
	return lots, nil
}

// getAttr return the value of an attribute in a list of attributes.
func getAttr(attrs []xml.Attr, name string) string {
	for _, attr := range attrs {
		if attr.Name.Local == name {
			return attr.Value
		}
	}
	return ""
}

func MigrateSvgToDb(filepath string) {
	// Initialize the database
	database.Init()
	database.DB.AutoMigrate(&models.Lot{}, &models.Grave{}, &models.Dead{})

	// TODO Create a save file for the database

	fmt.Println("Migrating the SVG file to the database")


	// Empty the Grave and Lot tables
	fmt.Println("Emptying the Grave and Lot tables")
	database.DB.Exec("DELETE FROM graves")
	database.DB.Exec("DELETE FROM lots")

	// Create a new SVGHelper
	svgHelper := NewSVGHelper(filepath)

	// Parse the SVG file
	lots, err := svgHelper.ParseSVG()
	if err != nil {
		fmt.Println("Error :", err)
		return
	}
	
	for _, lot := range lots {
		fmt.Println("Lot :", lot.Name)
		// Add the lot to the database
		if result := database.DB.Create(&lot); result.Error != nil {
			fmt.Println("Error :", result.Error)
			return
		}
	}

	// Show the first 10 graves
	// database.DB.Limit(10).Find(&graves)
	// for _, grave := range graves {
	// 	fmt.Println("Grave :", grave.ID)
	// }

	// Count the data in the database for the two tables
	var lotCount int64
	var graveCount int64
	database.DB.Model(&models.Lot{}).Count(&lotCount)
	database.DB.Model(&models.Grave{}).Count(&graveCount)

	fmt.Println("The data has been successfully migrated to the database")
	fmt.Println("Lots :", lotCount)
	fmt.Println("Graves :", graveCount)
}