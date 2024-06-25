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
  // private URL = 'http://3.142.124.217:3000/api';
  private userDataSubject = new BehaviorSubject<AuthResponse>({
    token: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    tipoUsuario: '',
    _id: ''
  });

  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Función para actualizar datos del usuario
  private actualizarDatosUsuario(response: AuthResponse): void {
    console.log('Actualizando datos del usuario:', response);
    if (response && response.token) {
      // Almacena el token en el localStorage
      localStorage.setItem('token', response.token);

      // Almacena otros detalles del usuario en localStorage
      localStorage.setItem('nombre', response.nombre || '');
      localStorage.setItem('apellidoPaterno', response.apellidoPaterno || '');
      localStorage.setItem('apellidoMaterno', response.apellidoMaterno || '');
      localStorage.setItem('tipoUsuario', response.tipoUsuario || '');
      localStorage.setItem('id',response._id||'');

      // Emite los datos del usuario a los suscriptores
      this.userDataSubject.next({
        token: response.token,
        nombre: response.nombre || '',
        apellidoPaterno: response.apellidoPaterno || '',
        apellidoMaterno: response.apellidoMaterno || '',
        tipoUsuario: response.tipoUsuario || '',
        _id: response._id || ''
      });
    }
  }

  // Función para realizar el registro
  registrar(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL + '/ingresar', user).pipe(
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

  // Función para iniciar sesión
  Iniciar(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL + '/iniciar', user).pipe(
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

  // Función para verificar si el usuario está autenticado
  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Función para obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Función para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/iniciar']);
  }

  // Función para verificar si un correo electrónico ya existe
  checkEmailExists(email: string): Observable<any> {
    const dato = '{"email":"' + email + '"}';
    const url = this.URL + '/verify-email';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, dato, { headers });
  }

  // Función para verificar la combinación de correo electrónico y contraseña al iniciar sesión
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

  // Funciones para obtener detalles del usuario del localStorage
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
  getId(): string | null {
    return localStorage.getItem('id');
  }
  
}
