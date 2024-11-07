import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interfaz opcional si deseas definir el tipo para la respuesta
export interface Informe {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  quejas: string;
  fecha: string;
  estado: "atendido" | "en_proceso" | "no_atendido";
}

@Injectable({
  providedIn: 'root'
})
export class InformesContactoService {
  private apiUrl = `${environment.baseUrl}:${environment.port}/api/informes`;

  //  private apiUrl = 'http://localhost:3000/api/informes';  // Ruta de tu servidor backend

  constructor(private http: HttpClient) {}

  // Método para enviar los datos del formulario
  enviarDatosContacto(formData: any): Observable<Informe> {
    // Enviar el formulario como cuerpo de la solicitud
    // console.log('Datos enviados al backend:', formData); 
    return this.http.post<Informe>(`${this.apiUrl}/informe`, formData); // Asegúrate de que la ruta '/informe' sea la correcta en tu servidor
  }
  obtenerInformes(): Observable<Informe[]> {
    return this.http.get<Informe[]>(`${this.apiUrl}/informes`).pipe(
      // Agregar un tap para ver la respuesta antes de devolverla
      tap((informes) => {
        console.log('Informes obtenidos:', informes);  // Muestra los informes recibidos
      })
    );
  }

  actualizarEstadoInforme(id: string, estado: 'atendido' | 'en_proceso' | 'no_atendido'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/informes/${id}`, { estado });  // Suponiendo que uses PATCH para actualizar solo el estado
  }
  
  
}
