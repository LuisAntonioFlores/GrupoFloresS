import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/Inicio';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL = 'http://localhost:3000/api';
  private userDataSubject = new BehaviorSubject<AuthResponse>({ token: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', tipoUsuario: '' });

  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private actualizarDatosUsuario(response: AuthResponse): void {
    if (response && response.token) {
      // Almacena el token en el localStorage
      localStorage.setItem('token', response.token);

      // Emite los datos del usuario a los suscriptores
      this.userDataSubject.next({
        token: response.token,
        nombre: response.nombre || '',
        apellidoPaterno: response.apellidoPaterno || '',
        apellidoMaterno: response.apellidoMaterno || '',
        tipoUsuario: response.tipoUsuario || '',
      });
    }
  }
  registrar(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL + '/ingresar', user)
      .pipe(
        map(response => {
          console.log('Respuesta completa del servidor (registrar):', response);
          this.actualizarDatosUsuario(response);
          return response;
        }),
        catchError(error => {
          console.error('Error en la solicitud de registro:', error);
          return throwError(error);
        })
      );
  }

  Iniciar(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL + '/iniciar', user)
      .pipe(
        map(response => {
          console.log('Respuesta completa del servidor (iniciar):', response);
          this.actualizarDatosUsuario(response);
          return response;
        }),
        catchError(error => {
          console.error('Error en la solicitud de inicio de sesión:', error);
          return throwError(error);
        })
      );
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/iniciar']);
  }

  checkEmailExists(email: string): Observable<any> {
    const dato = '{"email":"' + email + '"}';
    const url = this.URL + '/verify-email';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, dato, { headers });
  }

  checkInicioPass(email: string, password: string): Observable<any> {
    const dato = '{"email":"' + email + '", "password":"' + password + '"}';
    const url = this.URL + '/verify-inicio';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, dato, { headers }).pipe(
      map(response => {
        const typedResponse = response as { success?: boolean };

        if (typedResponse && typeof typedResponse === 'object') {
          const success = typedResponse.success === true;

          if (success) {
            console.log('Inicio de sesión exitoso');
          } else {
            console.warn('La propiedad "success" no está presente o es false en la respuesta.');
          }
        } else {
          console.warn('La respuesta no es un objeto.');
        }

        return response;
      }),
      catchError(error => {
        console.error('Error en la solicitud de inicio de sesión:', error);
        return throwError(error);
      })
    );
  }

  getNombre(): string | null {
    return localStorage.getItem('nombre');
  }

  getApellidoPaterno(): string | null {
    return localStorage.getItem('apellidoPaterno');
  }

  getApellidoMaterno(): string | null {
    return localStorage.getItem('apellidoMaterno');
  }

  getTipoUsuario(): string | null {
    return localStorage.getItem('tipoUsuario');
  }
}
