import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerificationServiceService {
  private apiUrl = `${environment.baseUrl}/api/verificacion`;

  constructor(private http: HttpClient) { }
  sendVerificationCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviar-codigo`, { email });
  }

  // Verificar el código
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verificar-codigo`, { email, code });
  }
}
