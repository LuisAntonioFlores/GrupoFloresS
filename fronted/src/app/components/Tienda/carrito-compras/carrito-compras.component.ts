import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoServiceService } from '../carrito-service.service';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/services/pedidos.service';
import { AuthService } from 'src/app/services/auth.service';
import { MercadoPagoService, Product } from 'src/app/services/mercado-pago.service';
import { Pedido } from 'src/app/interfaces/Pedidos';
@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.scss']
})
export class CarritoComprasComponent implements OnInit, OnDestroy {
  productosEnCarrito: any[] = [];
  carritoSubscription: Subscription | undefined;

  clienteId: string = '';


  constructor(
    private carritoService: CarritoServiceService,
     private router: Router,
     private pedidoService: PedidoService,
     private authService: AuthService,
     private mercadoPagoService: MercadoPagoService  ) { }

  ngOnInit() {
    this.carritoSubscription = this.carritoService.carrito$.subscribe((productos) => {
      this.productosEnCarrito = productos;
    });

    // Suscripción al userData$ para obtener el _id del usuario
    this.authService.userData$.subscribe((userData) => {
      this.clienteId = userData._id || '';
      // console.log(`p_Id: ${userData._id}`);
      // console.log('p2_Id: ' + userData._id);
      // console.log('cliente', this.clienteId);
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
  crearPedido(): Pedido {
    return {
      numero_Pedido: '12345', // Puedes hacer este número dinámico
      cliente_id: this.clienteId,
      date_Pedido: new Date(),
      status: 'Pending',
      items: this.productosEnCarrito.map(producto => ({
        product_id: producto._id,
        title: producto.title,
        quantity: producto.cantidadSeleccionada,  // Asegúrate de usar cantidadSeleccionada
        price: producto.price
      })),
      total_price: this.calcularTotal()
    };
  }
  

  continuarCompra() {
    const pedido: Pedido = this.crearPedido(); // Llamada al método crearPedido y asignación a la variable 'pedido'

    this.mercadoPagoService.crearPreferencia(pedido).subscribe(
        response => {
            // Verifica que la respuesta tenga el init_point
            const redirectUrl = response.init_point; // Obtiene la URL de redirección
            if (redirectUrl) {
                window.location.href = redirectUrl; // Redirige al usuario a la página de pago de Mercado Pago
            } else {
                console.error('No se recibió una URL de redirección válida');
                // Maneja el error adecuadamente aquí (por ejemplo, mostrando un mensaje al usuario)
            }
        },
        error => {
            console.error('Error al crear la preferencia:', error);
            // Maneja el error adecuadamente aquí (por ejemplo, mostrando un mensaje al usuario)
        }
    );
}

  
  
}