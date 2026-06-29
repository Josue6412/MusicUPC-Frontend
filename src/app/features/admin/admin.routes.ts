import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'artistas',
        loadComponent: () =>
          import('./artistas/artistas.component').then((m) => m.ArtistasComponent),
      },
      {
        path: 'generos',
        loadComponent: () =>
          import('./generos/generos.component').then((m) => m.GenerosComponent),
      },
      {
        path: 'regiones',
        loadComponent: () =>
          import('./regiones/regiones.component').then((m) => m.RegionesComponent),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./reservas/reservas.component').then((m) => m.ReservasComponent),
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('./pagos/pagos.component').then((m) => m.PagosComponent),
      },
      {
        path: 'reseñas',
        loadComponent: () =>
          import('./resenas/resenas.component').then((m) => m.ResenasComponent),
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./notificaciones/notificaciones.component').then(
            (m) => m.NotificacionesComponent,
          ),
      },
      {
        path: 'suscripciones',
        loadComponent: () =>
          import('./suscripciones/suscripciones.component').then(
            (m) => m.SuscripcionesComponent,
          ),
      },
      {
        path: 'terminos',
        loadComponent: () =>
          import('./terminos/terminos.component').then((m) => m.TerminosComponent),
      },
    ],
  },
];
