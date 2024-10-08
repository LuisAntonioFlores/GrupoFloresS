import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from 'src/app/interfaces/Producto';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoServiceService {
  private carritoSubject = new BehaviorSubject<Producto[]>([]);
  carrito$ = this.carritoSubject.asObservable();
  private productosAgregados: Set<string> = new Set<string>(); // Aquí está la propiedad

  constructor(private authService: AuthService) {
    console.log('Cargando carrito...');
    this.cargarCarrito();
  }

  
  private getUserId(): string | null {
    return this.authService.getId();
  }

  private getCartKey(): string {
    const userId = this.getUserId();
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      return 'cart_guest'; // Valor por defecto para usuarios no autenticados
  }
    const cartKey = `cart_${userId}`;
    console.log('Clave del carrito:', cartKey);
    return cartKey;
  }

  public cargarCarrito(): void {

    this.carritoSubject.next([]);
    this.productosAgregados.clear();

    const cartKey = this.getCartKey();
    const carritoGuardado = localStorage.getItem(cartKey);

    console.log('Cargando carrito desde localStorage con la clave: ${cartKey}', carritoGuardado);

    if (carritoGuardado) {
      const productos = JSON.parse(carritoGuardado);
      this.carritoSubject.next(productos);
      this.productosAgregados = new Set(productos.map((p: Producto) => p._id));
      console.log('Carrito cargado:', productos);
      console.log('Productos agregados:', Array.from(this.productosAgregados)); // Log de productos agregados

    } else {
      console.log('No se encontraron productos en el carrito');
    }
  }

  private guardarCarrito(): void {
    const cartKey = this.getCartKey();
    const productos = this.carritoSubject.getValue();
    localStorage.setItem(cartKey, JSON.stringify(productos));
    console.log('Carrito guardado en localStorage:', productos);
    console.log('Productos agregados (después de guardar):', Array.from(this.productosAgregados)); // Log de productos agregados

  }

  agregarAlCarrito(producto: Producto): void {
    const carritoActual = this.carritoSubject.getValue();
    console.log('Carrito actual antes de agregar:', carritoActual);

    const productoExistente = carritoActual.find(item => item._id === producto._id);

    if (!productoExistente) {
      console.log('Agregando producto al carrito:', producto);
      this.carritoSubject.next([...carritoActual, producto]);
      this.productosAgregados.add(producto._id);  // Añade el ID al conjunto de productos agregados
      this.guardarCarrito();
      console.log('Productos agregados después de añadir:', Array.from(this.productosAgregados)); // Log después de añadir
  
    } else {
      console.log('El producto ya está en el carrito:', producto);
    }
  }

  obtenerCarrito(): Producto[] {
    return this.carritoSubject.value;
  }

  limpiarCarrito(): void {
    this.carritoSubject.next([]);
    this.productosAgregados.clear(); 
    this.guardarCarrito();
    console.log('Carrito limpiado');
    console.log('Productos agregados después de limpiar:', Array.from(this.productosAgregados)); // Log después de limpiar

  }

  eliminarDelCarrito(producto: Producto): void {
    // Asegurar que se está utilizando la clave correcta de carrito
    const cartKey = this.getCartKey(); // Clave basada en el usuario actual
    console.log('Clave del carrito antes de eliminar:', cartKey);
  
    // Obtener el carrito actual del BehaviorSubject
    const carritoActual = this.carritoSubject.getValue();
    console.log('Carrito actual antes de eliminar:', carritoActual);
    console.log('Intentando eliminar el producto:', producto);
  
    // Buscar el producto en el carrito actual
    const index = carritoActual.findIndex(item => item._id === producto._id);
  
    if (index !== -1) {
      carritoActual.splice(index, 1); // Eliminar el producto del array
      console.log('Productos agregados antes de eliminar:', Array.from(this.productosAgregados));
  
      this.productosAgregados.delete(producto._id);  // Eliminar el producto del conjunto
      this.carritoSubject.next([...carritoActual]); // Actualizar el BehaviorSubject
  
      console.log('Producto eliminado del carrito:', producto);
      console.log('Productos agregados despues de eliminar:', Array.from(this.productosAgregados));
    } else {
      console.log('Producto no encontrado en el carrito:', producto);
    }
  
    // Guardar el carrito actualizado en localStorage bajo la clave correcta
    this.guardarCarrito();
    console.log('Carrito guardado después de eliminar:', JSON.stringify(this.carritoSubject.getValue()));
  }
  
  
}
