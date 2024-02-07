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
    const productoExistente = carritoActual.find(item => item._id === producto._id);
    
    if (!productoExistente) {
      // Si el producto no está en el carrito, lo agregamos
      this.carritoSubject.next([...carritoActual, producto]);
      this.productosAgregados.add(producto._id);
    } else {
      // Si el producto ya está en el carrito, no hacemos nada
      console.log('El producto ya está en el carrito');
    }
  }
  

  obtenerCarrito(): Producto[] {
    return this.carritoSubject.value;
  }

  limpiarCarrito(): void {
    this.carritoSubject.next([]);
     this.productosAgregados.clear();
  }

  eliminarDelCarrito(producto: Producto): void {
    const carritoActual = this.carritoSubject.getValue();
    const index = carritoActual.findIndex(item => item._id === producto._id);
    if (index !== -1) {
      carritoActual.splice(index, 1);
      this.productosAgregados.delete(producto._id);
      this.carritoSubject.next([...carritoActual]);
    }
  }

 

  constructor() {}
}
