import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Usar el chequeo con expiración (12h)
  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
