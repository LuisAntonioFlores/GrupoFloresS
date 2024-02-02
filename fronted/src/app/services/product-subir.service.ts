// product-subir.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductSubirService {
  constructor(private http: HttpClient) { }

  URI = 'http://localhost:3000/api/photos';

  createProduct(title: string, description: string, photo: File): Observable<Producto> {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('image', photo);
    return this.http.post<Producto>(this.URI, fd);
  }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.URI);
  }

  getProducto(id: String) {
    return this.http.get<Producto>(`${this.URI}/${id}`);

  }
  deleteProducto(id: String) {
    return this.http.delete(`${this.URI}/${id}`);
  }
  uptdateProducto(id: String, title: String, description: string) {
    return this.http.put(`${this.URI}/${id}`, { title, description });

  }
}
