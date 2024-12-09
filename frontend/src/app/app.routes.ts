import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/Login/Login.component';
import { HomeComponent } from './pages/Home/Home.component';
import { GuideComponent } from './pages/Guide/Guide.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'guide',
    component: GuideComponent,
    canActivate: [authGuard],
  },
];
