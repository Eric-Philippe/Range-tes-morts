package helpers

import (
	"backend/database"
	"backend/models"
	"fmt"
	"strconv"

	"github.com/xuri/excelize/v2"
)

type ExcelGenerator struct {
	file      *excelize.File
	fileName  string
	sheetName string
}

func NewExcelGenerator(fileName string, sheetName string) *ExcelGenerator {
	f := excelize.NewFile()
	f.NewSheet(sheetName)
	f.DeleteSheet("Sheet1")
	return &ExcelGenerator{
		file:      f,
		sheetName: sheetName,
		fileName:  fileName,
	}
}

func (eg *ExcelGenerator) SetHeaders(headers map[string]string) error {
	for col, header := range headers {
		if err := eg.file.SetCellValue(eg.sheetName, col+"1", header); err != nil {
			return err
		}
	}
	if err := eg.file.AutoFilter(eg.sheetName, "A1:F1", nil); err != nil {
		return err
	}
	return nil
}

func (eg *ExcelGenerator) SetCell(row, col, value string) error {
	return eg.file.SetCellValue(eg.sheetName, col+row, value)
}

func (eg *ExcelGenerator) ApplyStyles() error {
	headerStyle, err := eg.file.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold: true,
			Color: "FFFFFF",
		},
		Fill: excelize.Fill{
			Type:  "pattern",
			Color: []string{"4F81BD"},
			Pattern: 1,
		},
	})
	if err != nil {
		return err
	}
	if err := eg.file.SetCellStyle(eg.sheetName, "A1", "F1", headerStyle); err != nil {
		return err
	}

	dividerStyle, err := eg.file.NewStyle(&excelize.Style{
		Fill: excelize.Fill{
			Type:  "pattern",
			Color: []string{"D9D9D9"},
			Pattern: 1,
		},
	})
	if err != nil {
		return err
	}
	if err := eg.file.SetRowStyle(eg.sheetName, 2, 2, dividerStyle); err != nil {
		return err
	}

	if err := eg.file.SetColWidth(eg.sheetName, "A", "C", 15); err != nil {
		return err
	}
	if err := eg.file.SetColWidth(eg.sheetName, "D", "F", 25); err != nil {
		return err
	}

	return nil
}

func (eg *ExcelGenerator) InsertDivider(row int) error {
	for col := 'A'; col <= 'F'; col++ {
		if err := eg.SetCell(strconv.Itoa(row), string(col), ""); err != nil {
			return err
		}
	}
	style, err := eg.file.NewStyle(&excelize.Style{
		Fill: excelize.Fill{
			Type:  "pattern",
			Color: []string{"D9D9D9"},
			Pattern: 1,
		},
	})
	if err != nil {
		return err
	}
	if err := eg.file.SetRowStyle(eg.sheetName, row, row, style); err != nil {
		return err
	}
	return nil
}

func (eg *ExcelGenerator) SaveToFile(filename string) error {
	return eg.file.SaveAs(filename)
}

func GenerateExcelReport(fileName string, sheetName string, standalone bool) {
	if standalone {
		database.Init()
		database.DB.AutoMigrate(&models.Lot{}, &models.Grave{}, &models.Dead{})
	}

	lots := fetchLots()
	if err := generateExcelFile(lots, fileName, sheetName); err != nil {
		panic(err)
	}
}

func fetchLots() []models.Lot {
	var lots []models.Lot
	if err := database.DB.Preload("Graves.Deads").Find(&lots).Error; err != nil {
		fmt.Printf("Error fetching data: %v", err)
		return []models.Lot{}
	}
	return lots
}

func generateExcelFile(lots []models.Lot, fileName string, sheetName string) error {
	eg := NewExcelGenerator(fileName, sheetName)

	headers := map[string]string{
		"A": "Lot",
		"B": "Tombe",
		"C": "État",
		"D": "Prénom du défunt",
		"E": "Nom du défunt",
		"F": "Date d'enterrement",
	}
	if err := eg.SetHeaders(headers); err != nil {
		return err
	}

	row := 2
	for _, lot := range lots {
		lotName := translateLotName(lot.Name)
		if err := eg.SetCell(strconv.Itoa(row), "A", lotName); err != nil {
			return err
		}
		row++

		for _, grave := range lot.Graves {
			if err := eg.SetCell(strconv.Itoa(row), "B", grave.Identifier); err != nil {
				return err
			}
			if err := eg.SetCell(strconv.Itoa(row), "C", grave.State.ToString()); err != nil {
				return err
			}
			row++

			for _, dead := range grave.Deads {
				if err := eg.SetCell(strconv.Itoa(row), "D", dead.FirstName); err != nil {
					return err
				}
				if err := eg.SetCell(strconv.Itoa(row), "E", dead.LastName); err != nil {
					return err
				}
				if err := eg.SetCell(strconv.Itoa(row), "F", dead.EntryDateToString()); err != nil {
					return err
				}
				row++
			}
		}
		if err := eg.InsertDivider(row); err != nil {
			return err
		}
		row++
	}

	if err := eg.ApplyStyles(); err != nil {
		return err
	}

	return eg.SaveToFile(fileName)
}

func translateLotName(name string) string {
	if name == "PERPETUAL" {
		return "Perpétuel"
	}
	return name
}