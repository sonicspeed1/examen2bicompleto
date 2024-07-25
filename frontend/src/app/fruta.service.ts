import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrutaService {
  private apiUrl = 'http://localhost:3000/frutas';
  private readonly tokenKey = 'token'; 

  constructor(private http: HttpClient) {}

  getDatos(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`}); 
    return this.http.get<any>(this.apiUrl, { headers });
  }

  obtenerTemperaturaHoraria(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`}); 
    return this.http.get<any>(`${this.apiUrl}/temperatura-horaria`, { headers });
  }
 
  obtenerHumedadHoraria(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`}); 
    return this.http.get<any>(`${this.apiUrl}/humedad-horaria`, { headers });
  }

  
  obtenerAmoniacoHoraria(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`}); 
    return this.http.get<any>(`${this.apiUrl}/amoniaco-horario`, { headers });
  }

  
  obtenerHumoHoraria(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`}); 
    return this.http.get<any>(`${this.apiUrl}/humo-horario`, { headers });
  }

 
  obtenerMonoxidoCarbonoHoraria(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`}); 
    return this.http.get<any>(`${this.apiUrl}/monoxido-carbono-horario`, { headers });
  }
}