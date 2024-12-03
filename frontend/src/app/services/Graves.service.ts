import { Injectable } from '@angular/core';

import { API } from '../conf/env';
import { Grave } from '../models/Grave';
import { Dead } from '../models/Dead';

@Injectable()
export class GravesService {
  async updateGrave(grave: Grave): Promise<Grave> {
    return await fetch(`${API}/graves`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grave),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(response);
    });
  }

  async deleteDeads(deads: Dead[]): Promise<void> {
    return await fetch(`${API}/deads`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deads),
    }).then((response) => {
      if (response.ok) {
        return;
      }

      return Promise.reject(response);
    });
  }

  async editDeads(deads: Dead[]): Promise<void> {
    const URI = `${API}/deads`;

    return await fetch(URI, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deads),
    }).then((response) => {
      if (response.ok) {
        return;
      }

      return Promise.reject(response);
    });
  }
}
