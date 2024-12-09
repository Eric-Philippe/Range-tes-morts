import { Injectable } from '@angular/core';

import { API } from '../conf/env';
import { Grave } from '../models/Grave';
import { LotsService } from './Lots.service';

@Injectable()
export class GravesService {
  constructor(private lotsService: LotsService) {}

  async getGrave(id: string): Promise<Grave> {
    const token = localStorage.getItem('token');

    const lots = this.lotsService.getAll();
    const graves = (await lots).flatMap((lot) => lot.graves);

    return graves.find((grave) => grave.id === id) as Grave;
  }

  async updateGrave(grave: Grave): Promise<Grave> {
    const token = localStorage.getItem('token');

    return await fetch(`${API}/grave`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
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
}
