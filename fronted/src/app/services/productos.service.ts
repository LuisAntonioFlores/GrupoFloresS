import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private backendUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  agregarProducto(formData: FormData ) {
    return this.http.post(this.backendUrl, formData);
  }

}
