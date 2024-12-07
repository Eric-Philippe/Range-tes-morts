import { Injectable } from '@angular/core';
import { API } from '../conf/env';
import { Lot } from '../models/Lot';

@Injectable()
export class LotsService {
  async getAll(): Promise<Lot[]> {
    const token = localStorage.getItem('token');

    return await fetch(`${API}/lots`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(response);
    });
  }
}
