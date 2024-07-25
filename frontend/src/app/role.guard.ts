import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = route.data['role'];

    return this.authService.getUserType().pipe(
      map(role => {
        if (role !== expectedRole) {
          console.log(`Role '${role}' no tiene acceso a esta ruta.`);
          this.router.navigate(['/']);
          return false; 
        }
        return true; // Acceso permitido
      }),
      tap(accessGranted => {
        if (!accessGranted) {
          console.log(`Acceso denegado para el rol '${expectedRole}'. Redirigiendo al inicio.`);
        }
      })
    );
  }
}

