import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiResponse } from 'src/app/interfaces/copomex';
import { Direccion } from 'src/app/interfaces/direccion';
import { tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdressService {
  private Url = `${environment.baseUrl}:${environment.port}/api/direccion`;

  // private Url = 'http://localhost:3000/api/direccion'; 
  private apiUrl = 'https://api.copomex.com/query/info_cp/';
   private token = '94943e85-c875-4d3a-a54f-ec83952a8a33'; // Asegúrate de que este token sea válido

  constructor(private http: HttpClient,private authService: AuthService) {}

  guardarDireccionSeleccionada(direccionId: string): void {
    const userId = this.authService.getId();
    const key = `direccionSeleccionada_${userId}`;
    localStorage.setItem(key, direccionId);
    // localStorage.setItem('direccionSeleccionada', direccionId);
    // console.log(`Dirección seleccionada guardada en el servicio: ${direccionId}`);
  }

  // Obtener el ID de la dirección seleccionada de Local Storage
  obtenerDireccionSeleccionada(): string | null {
    const userId = this.authService.getId(); // Obtén el ID del usuario
    const key = `direccionSeleccionada_${userId}`; // Crea la misma clave única
    const direccionId = localStorage.getItem(key);
    // console.log(`Dirección seleccionada recuperada del servicio: ${direccionId}`);
    return direccionId;
  }

  obtenerDireccionPorId(direccionId: string): Observable<Direccion> {
    // console.log(`Obteniendo dirección con ID: ${direccionId}`);
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' });
    return this.http.get<Direccion>(`${this.Url}/direccion/${direccionId}`, { headers }).pipe(
      tap((direccion) => {
        // console.log('Dirección obtenida desde el servidor:', direccion);
      }),
      catchError(this.handleError)
    );
  }
  
  
  
  
  
  
  
  obtenerDirecciones(cliente_id: string): Observable<any> {
    const url = `${this.Url}/${cliente_id}`; // Construcción dinámica de la URL
    
    return this.http.get(url).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Manejo de errores
  
  
 // Método para guardar la dirección
 guardarDireccion(data: any): Observable<any> {
  // console.log('Datos que se enviarán al backend:', data);
  return this.http.post(`${this.Url}/guardar`, data).pipe(
    catchError(this.handleError) // Maneja errores al guardar
  );
}
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`, // Enviando el token correctamente
      'Content-Type': 'application/json'
    });
  }

 
  
  obtenerDatosPorCodigoPostal(cp: string): Observable<ApiResponse[]> {
    return this.validatePostalCode(cp).pipe(
      switchMap(() =>
        this.http.get<ApiResponse[]>(`${this.apiUrl}/${cp}?token=pruebas`).pipe(
          catchError(this.handleError)
        )
      )
    );
  }
  
  private validatePostalCode(cp: string): Observable<void> {
    if (cp.length !== 5 || isNaN(Number(cp))) {
      return throwError('El código postal debe tener exactamente 5 dígitos.');
    }
    return new Observable<void>(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
