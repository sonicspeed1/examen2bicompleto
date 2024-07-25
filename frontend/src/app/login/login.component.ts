import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      () => {

        this.authService.getUserType().subscribe(
          userType => {
        
            if (userType === 'administrador') {
              this.router.navigate(['/crear-usuarios']);
            } else if (userType === 'operador') {
              this.router.navigate(['/dashboard']);
            } else {
            
              this.router.navigate(['/home']);
            }
          },
          error => {
            console.error('Error al obtener el tipo de usuario después de iniciar sesión:', error);
            this.loginError = 'Error al obtener el tipo de usuario';
          }
        );
      },
      error => {
        console.error('Error en el inicio de sesión:', error);
        this.loginError = 'Correo o contraseña incorrectos';
      }
    );
  }
}