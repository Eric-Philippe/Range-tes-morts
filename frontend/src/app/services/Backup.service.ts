import { Injectable } from '@angular/core';
import { API } from '../conf/env';

@Injectable()
export class BackupService {
  async downloadXlsxBackup() {
    const token = localStorage.getItem('token');

    return await fetch(`${API}/backup/xlsx`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem('token');

    return await fetch(`${API}/backup/map`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
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
