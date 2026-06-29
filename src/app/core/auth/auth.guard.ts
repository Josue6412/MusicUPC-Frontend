import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Permite el acceso sólo a usuarios con rol ADMINISTRADOR. */
export const adminGuard: CanActivateFn & CanActivateChildFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }
  if (auth.getRole() === 'ADMINISTRADOR') {
    return true;
  }
  return router.createUrlTree(['/usuario/reservas']);
};
