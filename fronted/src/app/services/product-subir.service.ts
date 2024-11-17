// product-subir.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/Producto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductSubirService {
  constructor(private http: HttpClient) { }

  URI = `${environment.baseUrl}/api/producto`;
  // URI = `${environment.baseUrl}:${environment.port}/api/producto`;
  // URI = 'http://3.142.124.217:3000/api/producto';

  createProduct(title: string, description: string, price: number, quantity: number, photo: File): Observable<Producto> {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('price', price.toString());  
    fd.append('quantity', quantity.toString());
    fd.append('image', photo);
    return this.http.post<Producto>(this.URI, fd);
  }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.URI);
  }

  getProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.URI}/${id}`);
  }

  deleteProducto(id: string): Observable<any> {
    return this.http.delete(`${this.URI}/${id}`);
  }

  uptdateProducto(id: string, title: string, description: string, price: number, quantity: number,enOferta: boolean): Observable<any> {
    const body = { title, description, price, quantity, enOferta };
  
  // Mostrar el cuerpo de la solicitud antes de enviarla
  // console.log('Datos enviados en la solicitud PUT:', body);

    return this.http.put(`${this.URI}/${id}`, { title, description, price, quantity, enOferta });
  }
}
