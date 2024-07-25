import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-actualizar-contraseniaa',
  templateUrl: './actualizar-contraseniaa.component.html',
  styleUrls: ['./actualizar-contraseniaa.component.css']
})
export class ActualizarContraseniaaComponent {
  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      verifypass: ['', [Validators.required]]
    });
  }

  cambiarContrasenia() {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword, verifypass } = this.passwordForm.value;

      if (newPassword !== verifypass) {
        this.errorMessage = 'Ponga la misma contraseña en los campos últimos (nueva y verificar)';
        this.successMessage = '';
      } else {
        this.authService.cambiarContrasenia(oldPassword, newPassword).subscribe(
          (response: any) => {
            this.successMessage = response.message || 'Contraseña actualizada exitosamente';
            this.errorMessage = '';
          },
          error => {
            this.errorMessage = error.error.error || 'Error al cambiar la contraseña';
            this.successMessage = '';
          }
        );
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
    }
  }
}
