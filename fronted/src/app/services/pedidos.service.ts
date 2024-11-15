import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Pedido } from '../interfaces/Pedidos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  constructor(private http: HttpClient) { }

  // La URI ahora apunta correctamente a la ruta que maneja los pedidos.
  URI = `${environment.baseUrl}:${environment.port}/api/pago/`;

  
  // Para obtener los pedidos de un cliente específico
  getPedidos(clienteId: string): Observable<Pedido[] | { message: string }> {
    return this.http.get<Pedido[]>(`${this.URI}/pedidos/${clienteId}`).pipe(
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
    return this.http.get<Pedido>(`${this.URI}/pedido/${id}`);
  }
  // Para obtener todos los pedidos
  getAllPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.URI}`);
  }
  
 
 
}
