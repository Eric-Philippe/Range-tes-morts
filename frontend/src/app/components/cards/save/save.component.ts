import { Component } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { BackupService } from '../../../services/Backup.service';

@Component({
  standalone: true,
  selector: 'save-card',
  templateUrl: './save.component.html',
  imports: [ImportsModule],
  providers: [BackupService],
})
export class SaveCard {
  constructor(private backupService: BackupService) {}

  downloadExcel() {
    this.backupService.downloadXlsxBackup().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      a.download = this.generateName() + '.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);

      a.remove();
    });
  }

  downloadMap() {
    this.backupService.downloadMapBackup().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = this.generateName() + '.png';
      a.click();

      window.URL.revokeObjectURL(url);

      a.remove();
    });
  }

  /**
   * @returns {string} - The generated name
   * 05122024_1549_excel_cimetire.xlsx
   */
  generateName() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day}${month}${year}_${hours}${minutes}_excel_cimetire`;
  }
}
