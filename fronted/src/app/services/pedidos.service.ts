import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Pedido, RespuestaPedidos } from '../interfaces/Pedidos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  constructor(private http: HttpClient) { }

  // La URI ahora apunta correctamente a la ruta que maneja los pedidos.
  URI = `${environment.baseUrl}/api`;
  // URI = `${environment.baseUrl}:${environment.port}/api/pago/`;

  
  // Para obtener los pedidos de un cliente específico
  getPedidos(clienteId: string): Observable<Pedido[] | { message: string }> {
    return this.http.get<Pedido[]>(`${this.URI}/pago/pedidos/${clienteId}`).pipe(
        catchError((error: HttpErrorResponse) => {
            // Retornamos el mensaje de error en caso de recibir un 404
            if (error.status === 404) {
                return of(error.error); // Retornamos el mensaje de error como un Observable
            }
            return throwError(() => error); // Otros errores se manejan normalmente
        })
    );
}


  // Para obtener un pedido específico por su ID
  getPedido(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.URI}/pago/pedido/${id}`);
  }
  // Para obtener todos los pedidos
  getAllPedidos(): Observable<RespuestaPedidos> {
    return this.http.get<RespuestaPedidos>(`${this.URI}/Pedido/Pedido`);
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
 

