import { Injectable } from '@angular/core';

import { API } from '../conf/env';
import { Dead } from '../models/Dead';

@Injectable()
export class DeadsService {
  async createDead(dead: Dead): Promise<Dead> {
    const token = localStorage.getItem('token');

    return await fetch(`${API}/dead`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dead),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(response);
    });
  }

  async createDeads(deads: Dead[]): Promise<Dead[]> {
    const createdDeads: Dead[] = [];

    for (const dead of deads) {
      createdDeads.push(await this.createDead(dead));
    }

    return createdDeads;
  }

  async deleteDead(dead: Dead): Promise<void> {
    const token = localStorage.getItem('token');

    return await fetch(`${API}/dead/${dead.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        return;
      }

      return Promise.reject(response);
    });
  }

  async deleteDeads(deads: Dead[]): Promise<void> {
    for (const dead of deads) {
      await this.deleteDead(dead);
    }
  }

  async updateDead(dead: Dead): Promise<void> {
    const token = localStorage.getItem('token');

    return await fetch(`${API}/dead/${dead.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dead),
    }).then((response) => {
      if (response.ok) {
        return;
      }

      return Promise.reject(response);
    });
  }

  async updateDeads(deads: Dead[]): Promise<void[]> {
    return await Promise.all(deads.map((dead) => this.updateDead(dead)));
  }
}
