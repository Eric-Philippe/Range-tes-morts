import { Injectable } from '@angular/core';
import { API } from '../conf/env';

@Injectable()
export class BackupService {
  async downloadXlsxBackup() {
    return await fetch(`${API}/backup/xlsx`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.blob();
      }

      return Promise.reject(response);
    });
  }

  async downloadMapBackup() {
    return await fetch(`${API}/backup/map`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.blob();
      }

      return Promise.reject(response);
    });
  }
}
