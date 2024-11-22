import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  
  private apiUrl = `${environment.baseUrl}/api/auth`; // Ajusta según tu configuración

  constructor(private http: HttpClient) {}

  recuperarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  cambiarContrasena(token: string, newPassword: string) {
    const url = `${this.apiUrl}/reset-password`; // Ajusta la ruta según tu backend
    return this.http.post(url, { token, newPassword });
  }
  
}
