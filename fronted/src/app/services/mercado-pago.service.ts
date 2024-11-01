    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { Pedido } from '../interfaces/Pedidos';
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
      private apiUrl = 'http://localhost:3000/api/pago'; 
      constructor(private http: HttpClient) { }

      

      crearPreferencia(pedido: Pedido): Observable<any> {
        console.log('Pedido enviado a la API:', pedido);  
        return this.http.post(`${this.apiUrl}/create_preference`, { 
          products: pedido.items,
          cliente_id: pedido.cliente_id,
          direccion_id: pedido.direccion_id
        });
        
      }
    }