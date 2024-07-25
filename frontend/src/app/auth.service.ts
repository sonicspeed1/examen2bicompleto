import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap} from 'rxjs/operators';

interface Usuario {
  name: string;
  email: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/users';
  private readonly tokenKey = 'token'; 

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userTypeSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    
  }

  register(name: string, email: string, password: string, tipo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password, tipo });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.storeToken(response.token);
          this.checkAuthenticated();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.userTypeSubject.next('');
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUserType(): Observable<string> {
    return this.userTypeSubject.asObservable();
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private checkAuthenticated(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.fetchUserType();
    } else {
      this.isAuthenticatedSubject.next(false);
      this.userTypeSubject.next('');
    }
  }

  private fetchUserType(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.http.get<any>(`${this.apiUrl}/role`, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
        response => {
          this.userTypeSubject.next(response.tipo);
        },
        error => {
          console.error('Error al obtener el tipo de usuario:', error);
        }
      );
    } else {
      console.error('Token no encontrado en localStorage.');
    }
  }

  fetchUsers(): Observable<Usuario[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Usuario[]>(`${this.apiUrl}/obtener_usuarios`,{headers});
  }
   
  cambiarContrasenia(oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = { oldPassword, newPassword };
    return this.http.put(`${this.apiUrl}/cambiar-clave`, body, { headers }).pipe(
      tap(response => {
        console.log('Contraseña cambiada exitosamente:', response);
      })
    );
  }
  deleteUser(userId: string): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const url = `${this.apiUrl}/delete/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(url, { headers });
  }
  actualizarusuario(userId: string, userData: any): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const url = `${this.apiUrl}/actualizar/${userId}`;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<any>(url, userData, { headers });
  }
}