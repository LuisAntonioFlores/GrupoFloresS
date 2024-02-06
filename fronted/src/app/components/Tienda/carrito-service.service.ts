import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from 'src/app/interfaces/Producto';

@Injectable({
  providedIn: 'root',
})
export class CarritoServiceService {
  private carritoSubject = new BehaviorSubject<Producto[]>([]);
  carrito$ = this.carritoSubject.asObservable();
  private productosAgregados: Set<string> = new Set<string>();

  agregarAlCarrito(producto: Producto): void {
    const carritoActual = this.carritoSubject.getValue();
    if (!this.productosAgregados.has(producto._id)) {
      this.productosAgregados.add(producto._id);
      
      this.carritoSubject.next([...carritoActual, producto]);
    }
  }
  obtenerCarrito(): Producto[] {
    return this.carritoSubject.value;
  }

  constructor() {}
}
