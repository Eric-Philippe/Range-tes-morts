package handlers

import (
	"backend/helpers"
	"net/http"

	"os"
	"time"
)

func GetExcelBackup(w http.ResponseWriter, r *http.Request) {
	todayDate := time.Now().Format("02012006")
	todayTime := time.Now().Format("1504")

	fileName := "gen/" + todayDate + "-" + todayTime + "-backup.xlsx"

	helpers.GenerateExcelReport(fileName, "Cimetière", false)

	http.ServeFile(w, r, fileName)

	// Delete the file after sending it
	os.Remove(fileName)
}