    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable, tap } from 'rxjs';
    import { Pedido } from '../interfaces/Pedidos';
import { environment } from 'src/environments/environment';
   
    // Interface de producto
    export interface Product {
      product_id: string; 
      title: string;
      quantity: number;
      price: number;
    }
  
    @Injectable({
      providedIn: 'root',
    })
    export class MercadoPagoService {

  private apiUrl = `${environment.baseUrl}:${environment.port}/api/pago`;
      // private apiUrl = 'http://localhost:3000/api/pago'; 
      constructor(private http: HttpClient) { }

      

      crearPreferencia(pedido: Pedido): Observable<any> {
        console.log('Pedido enviado a la API:', pedido);  
        return this.http.post(`${this.apiUrl}/create_preference`, { 
          products: pedido.items,
          cliente_id: pedido.cliente_id,
          direccion_id: pedido.direccion_id
        });
        
      }

      obtenerEstadoPago(clienteId: string): Observable<any> {
        console.log('Solicitando estado de pago para clienteId:', clienteId); // Verificar que se está llamando
        return this.http.get<any>(`${this.apiUrl}/estado-pago/${clienteId}`).pipe(
          tap((response) => {
            console.log('Respuesta del estado de pago:', response); // Ver la respuesta del servidor
          })
        );
      }
      
    }
