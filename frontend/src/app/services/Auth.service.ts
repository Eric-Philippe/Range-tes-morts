import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { API } from '../conf/env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);

  login(data: any) {
    return this.httpClient.post(`${API}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('authUser', data.username);
        localStorage.setItem('name', res.name);
      })
    );
  }

  logout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('name');
  }

  isLoggedIn() {
    //return !!localStorage.getItem('authUser');
    return true;
  }

  constructor() {}
}