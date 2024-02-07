import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoServiceService } from '../carrito-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.scss']
})
export class CarritoComprasComponent implements OnInit, OnDestroy {
  productosEnCarrito: any[] = [];
  carritoSubscription: Subscription | undefined;

  
  constructor(private carritoService: CarritoServiceService, private router: Router) { }

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

  incrementarCantidad(producto: any) {
    if (producto.cantidadSeleccionada < producto.quantity) {
      producto.cantidadSeleccionada++;
    } else {
      alert('La cantidad seleccionada no puede ser mayor que la cantidad disponible.');
    }
  }

  decrementarCantidad(producto: any) {
    if (producto.cantidadSeleccionada > 1 && producto.cantidadSeleccionada > 200) {
      producto.cantidadSeleccionada--;
    } else {
      alert('La cantidad seleccionada no puede ser menor que 200 ni menor que 1.');
    }
  }
  verificarCantidad(producto: any, cantidad: number) {
    if (cantidad > producto.quantity) {
      alert('La cantidad seleccionada no puede ser mayor que la cantidad disponible.');
      producto.cantidadSeleccionada = producto.quantity;
    } else if (cantidad < 200) {
      alert('La cantidad seleccionada no puede ser menor que 200.');
      producto.cantidadSeleccionada = 200;
    }
  }
  
  

  eliminarDelCarrito(producto: any) {
    const index = this.productosEnCarrito.indexOf(producto);
    if (index !== -1) {
      this.productosEnCarrito.splice(index, 1);
      this.carritoService.eliminarDelCarrito(producto);
    }
  }
  

  redirigirACompras() {
    this.router.navigate(['/dashboard/Shop/Tienda']); 
     }
     vaciarCarrito() {
      this.carritoService.limpiarCarrito();
    }

    continuarCompra() {
      console.log('Datos del carrito:');
      this.productosEnCarrito.forEach(producto => {
        console.log('ID:', producto._id);
        console.log('Imagen:', producto.imagePath);
        console.log('Precio:', producto.price);
        console.log('Cantidad Seleccionada:', producto.cantidadSeleccionada);
        console.log('Subtotal:', this.calcularSubtotal(producto));
      });
      console.log('Total:', this.calcularTotal());
    }
    
}