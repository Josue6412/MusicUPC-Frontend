import { Routes } from '@angular/router';
import { UsuarioLayoutComponent } from './usuario-layout.component';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    component: UsuarioLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'artistas' },
      {
        path: 'artistas',
        loadComponent: () =>
          import('./artistas/artistas-catalogo.component').then(
            (m) => m.ArtistasCatalogoComponent,
          ),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./reservas/reservas.component').then((m) => m.MisReservasComponent),
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./notificaciones/notificaciones').then(
            (m) => m.NotificacionesComponent,
          ),
      },
      {
        path: 'resenas',
        loadComponent: () =>
          import('./resenas/resenas').then(
            (m) => m.ResenasComponent,
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./perfil/perfil.component').then((m) => m.PerfilComponent),
      },
      {
        path:'notificaciones',
        loadComponent: () =>
          import('./notificaciones/notificaciones')
          .then(m => m.NotificacionesComponent)
      },
      {
        path:'resenas',
        loadComponent: () =>
        import('./resenas/resenas')
        .then(m => m.ResenasComponent)
      },
      {
        path: 'suscripcion',
        loadComponent: () =>
          import('./suscripcion/suscripcion').then((m) => m.SuscripcionUsuarioComponent),
      },
    ],
  },
];
