import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../interfaces/Pedidos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  constructor(private http: HttpClient) { }

  URI = `${environment.baseUrl}:${environment.port}/api/Pedido`;
  // URI = 'http://3.142.124.217:3000/api/Pedido';

  createPedido(pedidoData: any): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.URI}`, pedidoData);
  }

  getAllPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.URI}`);
  }

  getPedido(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.URI}/${id}`);
  }

  deletePedido(id: string): Observable<any> {
    return this.http.delete(`${this.URI}/${id}`);
  }

  updatePedido(id: string, pedidoData: any): Observable<any> {
    return this.http.put(`${this.URI}/uptdateP/${id}`, pedidoData);
  }
}
