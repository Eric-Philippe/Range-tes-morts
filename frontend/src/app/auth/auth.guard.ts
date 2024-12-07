import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/Auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().then((isLoggedIn) => {
    if (!isLoggedIn) {
      router.navigate(['/login']);
    }

    return isLoggedIn;
  });
};
