import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/auth.guard';
import { usuarioGuard } from './core/auth/usuario.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'recuperar',
    loadComponent: () =>
      import('./features/recuperar/recuperar.component').then((m) => m.RecuperarComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'usuario',
    canActivate: [usuarioGuard],
    canActivateChild: [usuarioGuard],
    loadChildren: () =>
      import('./features/usuario/usuario.routes').then((m) => m.USUARIO_ROUTES),
  },
  { path: '**', redirectTo: 'login' },
];
