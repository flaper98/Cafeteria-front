import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models';
import { rutaInicialPara } from '../../layout/shell/nav-items';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const rolesPermitidos = route.data?.['roles'] as Rol[] | undefined;
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rol = auth.currentUser()?.rol;
    if (!rol || !rolesPermitidos.includes(rol)) {
      return router.createUrlTree([rutaInicialPara(rol ?? 'mozo')]);
    }
  }

  return true;
};
