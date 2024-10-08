// user-cart.service.ts
import { Injectable } from '@angular/core';
import { CarritoServiceService } from '../components/Tienda/carrito-service.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserCartService {
  constructor(private carritoService: CarritoServiceService, private authService: AuthService) {}

  limpiarCarrito() {
    this.carritoService.limpiarCarrito();
  }

  cargarCarrito() {
    this.carritoService.cargarCarrito();
  }
}
