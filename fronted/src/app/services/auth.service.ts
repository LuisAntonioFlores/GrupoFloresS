import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/Inicio';
import { CarritoServiceService } from '../components/Tienda/carrito-service.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private URL = `${environment.baseUrl}:${environment.port}/api`;
  
  private cargarDatosUsuario(): void {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const userData: AuthResponse = {
        token: localStorage.getItem('token') || '',
        nombre: localStorage.getItem('nombre') || '',
        apellidoPaterno: localStorage.getItem('apellidoPaterno') || '',
        apellidoMaterno: localStorage.getItem('apellidoMaterno') || '',
        sexo:localStorage.getItem('sexo')||'',
        tipoUsuario: localStorage.getItem('tipoUsuario') || '',
        _id: localStorage.getItem('id') || '',
        fechaNacimiento:localStorage.getItem('fechaNacimiento')||'',
        imagen: localStorage.getItem('imagen') || '' 
      };

      // Actualizar el BehaviorSubject con los datos recuperados del localStorage
      this.userDataSubject.next(userData);
    }
  }

  actualizarPerfil(userData: any): Observable<any> {
    const url = `${this.URL}/update-profile`; // Cambia la URL según la ruta de tu API
  
    // Enviar la solicitud POST con los datos del usuario
    return this.http.post<any>(url, userData).pipe(
      catchError(error => {
        console.error('Error en la actualización del perfil:', error);
        return throwError(error);
      })
    );
  }
  

  private userDataSubject = new BehaviorSubject<AuthResponse>({
    token: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    sexo:'',
    tipoUsuario: '',
    _id: '' ,
    fechaNacimiento:'',
    imagen: '' 
  });

  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { 
    this.cargarDatosUsuario();
  }

  // Función para actualizar datos del usuario
  private actualizarDatosUsuario(response: AuthResponse): void {
   // console.log('Actualizando datos del usuario:', response);
    if (response && response.token) {
      // Almacena el token en el localStorage
      localStorage.setItem('token', response.token);

      // Almacena otros detalles del usuario en localStorage
      localStorage.setItem('nombre', response.nombre || '');
      localStorage.setItem('apellidoPaterno', response.apellidoPaterno || '');
      localStorage.setItem('apellidoMaterno', response.apellidoMaterno || '');
      localStorage.setItem('sexo', response.sexo || '');
      localStorage.setItem('tipoUsuario', response.tipoUsuario || '');
      localStorage.setItem('id', response._id || '');
      localStorage.setItem('email', response.email || '');  // Almacena el correo electrónico
      localStorage.setItem('fechaNacimiento', response.fechaNacimiento || ''); 
      localStorage.setItem('imagen', response.imagen || ''); 
       // Almacena la fecha de nacimiento
  
      // Imprime el ID del usuario
   //   console.log('ID del usuario almacenado:', response._id);

      // Emite los datos del usuario a los suscriptores
      this.userDataSubject.next({
        token: response.token,
        nombre: response.nombre || '',
        apellidoPaterno: response.apellidoPaterno || '',
        apellidoMaterno: response.apellidoMaterno || '',
        sexo:response.sexo || '',
        tipoUsuario: response.tipoUsuario || '',
        _id: response._id || '',
        email: response.email || '',  // Incluye el correo electrónico
        fechaNacimiento: response.fechaNacimiento || '' ,
        imagen: response.imagen || '' // Incluye la fecha de nacimiento
   
      });
    }
  }

  // Método para obtener el perfil del usuario
getProfile(): Observable<AuthResponse> {
  const url = `${this.URL}/perfil`; // Ruta de tu API para obtener el perfil
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.getToken()}` // Añade el token en los headers
  });

  return this.http.get<AuthResponse>(url, { headers }).pipe(
    map(response => {
      // Actualiza los datos del usuario en localStorage si es necesario
      this.actualizarDatosUsuario(response);
      return response;
    }),
    catchError(error => {
      console.error('Error al obtener el perfil:', error);
      return throwError(error);
    })
  );
}

  // Función para realizar el registro
  registrar(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL + '/ingresar', user).pipe(
      map(response => {
      //  console.log('Respuesta completa del servidor (registrar):', response);
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
  Iniciar(user: any, carritoService: CarritoServiceService): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.URL + '/iniciar', user).pipe(
      map(response => {
      //  console.log('Respuesta completa del servidor (iniciar):', response);
        this.actualizarDatosUsuario(response);
        
     
        carritoService.cargarCarrito();
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
    this.router.navigate(['/home']);
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
 getSexo():string | null{
  return localStorage.getItem('sexo');
 }
  getTipoUsuario(): string | null {
    return localStorage.getItem('tipoUsuario');
  }
  getId(): string | null {
       return localStorage.getItem('id');

  }
  getEmail(): string | null {
    return localStorage.getItem('email');
  }
  
  getFechaNacimiento(): string | null {

    return localStorage.getItem('fechaNacimiento');
  }
  getImagen(): string | null {
    return localStorage.getItem('imagen');
  }

}
