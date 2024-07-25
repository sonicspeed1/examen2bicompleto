import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css']
})
export class CrearUsuariosComponent implements OnInit {
  registerForm!: FormGroup;  // ¡Nota el uso de "!" para inicializar más tarde
  registerError: string = '';
  registerSuccess: string='';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+\-]+@ups\.edu\.ec$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]],
      tipo: ['operador']
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerError = 'Formulario inválido. Por favor, revise los campos.';
      return;
    }

    const { name, email, password, tipo } = this.registerForm.value;

    this.authService.register(name, email, password, tipo).subscribe(
      () => {
        console.log('Usuario registrado exitosamente.');
        this.registerError='';
        this.registerSuccess = 'Usuario registrado exitosamente.';
      },
      error => {
        console.error('Error en el registro:', error);
        this.registerSuccess='';
        this.registerError = 'Error al registrar usuario';
      }
    );
  }
}