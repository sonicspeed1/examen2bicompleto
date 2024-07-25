import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

interface Usuario {
  _id?: string;
  name: string;
  email: string;
  tipo: string;
}

@Component({
  selector: 'app-consultar-usuarios',
  templateUrl: './consultar-usuarios.component.html',
  styleUrls: ['./consultar-usuarios.component.css']
})
export class ConsultarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = []; 
  editingUser: Usuario | null = null;
  newPassword: string = '';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.authService.fetchUsers().subscribe(
      (users: Usuario[]) => {
        this.usuarios = users;
        console.log('Usuarios obtenidos:', this.usuarios); 
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  eliminarUsuario(userId?: string): void {
    if (userId) {
      this.authService.deleteUser(userId).subscribe({
        next: (response) => {
          console.log('Usuario eliminado:', response);
          this.fetchUsers(); 
        },
        error: (error) => {
          console.error('Error al eliminar el usuario:', error);
        }
      });
    } else {
      console.error('ID de usuario no proporcionado');
    }
  }
  editarUser(usuario: Usuario): void {
    this.editingUser = { ...usuario };
    this.newPassword = ''; // Limpiar el campo de nueva contraseña
  }

  guardarcambios(userId: string): void {
    if (this.editingUser) {
      const updatedUser = { ...this.editingUser, newPassword: this.newPassword };
      this.authService.actualizarusuario(userId,updatedUser).subscribe({
        next: (response) => {
          console.log('Usuario actualizado:', response);
          this.fetchUsers();
          this.cancelarEdit();
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      });
    }
  }

  cancelarEdit(): void {
    this.editingUser = null;
    this.newPassword = ''; 
  }

  
}