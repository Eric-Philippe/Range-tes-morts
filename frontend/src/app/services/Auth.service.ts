import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SERVER_URL } from '../conf/env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);

  async login(data: any) {
    return await fetch(`${SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(response);
    });
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  constructor() {}
}
