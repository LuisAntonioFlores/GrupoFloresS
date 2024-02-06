import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoServiceService } from '../carrito-service.service';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.scss']
})
export class CarritoComprasComponent implements OnInit, OnDestroy {
  productosEnCarrito: any[] = [];
  carritoSubscription: Subscription | undefined;

  constructor(private carritoService: CarritoServiceService) {}

  ngOnInit() {
    this.carritoSubscription = this.carritoService.carrito$.subscribe((productos) => {
      this.productosEnCarrito = productos;
    });
  }

  ngOnDestroy() {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  calcularTotal(): number {
    return this.productosEnCarrito.reduce((total, producto) => total + this.calcularSubtotal(producto), 0);
  }

  calcularSubtotal(producto: any): number {
    return producto.price * (producto.cantidadSeleccionada || 0);
  }
}
