import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CarritoServiceService } from '../carrito-service.service';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/services/pedidos.service';
import { AuthService } from 'src/app/services/auth.service';
import { MercadoPagoService, Product } from 'src/app/services/mercado-pago.service';
import { Pedido } from 'src/app/interfaces/Pedidos';
import { AdressService } from '../../adress/adress.service';
import { Direccion } from 'src/app/interfaces/direccion';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.scss']
})
export class CarritoComprasComponent implements OnInit, OnDestroy {
  productosEnCarrito: any[] = [];
  carritoSubscription: Subscription | undefined;
  clienteId: string = '';
  direccion: string | null = null;
  codigoPostal: string | null = null;
  direccionCompleta: Direccion | null = null;
  estadoPago: any;
  estadoPagoSubscription: Subscription | undefined;
  private socketSubscription: Subscription | undefined;
  constructor(
    private carritoService: CarritoServiceService,
    private router: Router,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private mercadoPagoService: MercadoPagoService,
    private adressService: AdressService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.cargarCarrito();
    this.subscribirAlCarrito();
    this.clienteId = this.authService.getId() || localStorage.getItem('clientId') || '';
   
    
    this.cargarDireccion();
  }

  ngOnDestroy() {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
    if (this.estadoPagoSubscription) {
      this.estadoPagoSubscription.unsubscribe();
    }
    this.desconectarSocketSiCarritoVacio();
  }

  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.productosEnCarrito = JSON.parse(carritoGuardado);
    }
  }

  subscribirAlCarrito() {
    this.carritoSubscription = this.carritoService.carrito$.subscribe((productos) => {
      this.productosEnCarrito = productos;
    });
  }

  listenToUpdates() {
    this.socketSubscription = this.socketService.listenToEvent('updateEvent').subscribe((data) => {
      console.log('Actualización recibida:', data);
      //this.eliminarProductoDelCarrito(data.productId);
      this.desconectarSocketSiCarritoVacio();
    });
  }
  cargarDireccion() {
    const direccionIdGuardada = this.adressService.obtenerDireccionSeleccionada();
    if (direccionIdGuardada) {
      this.adressService.obtenerDireccionPorId(direccionIdGuardada).subscribe(
        (direccion) => {
          if (direccion) {
            this.codigoPostal = direccion.codigoPostal || 'Código postal no disponible';
          } else {
            this.codigoPostal = 'Código postal no disponible';
          }
        },
        (error) => {
          console.error('Error al obtener la dirección:', error);
        }
      );
    }
    else {
      // Si no hay dirección guardada, mostrar alerta y redirigir
      this.mostrarAlertaYRedirigir();
    }
  }

  mostrarAlertaYRedirigir() {
    const mensaje = 'Selecciona tu dirección';
    alert(mensaje);
    this.router.navigate(['/dashboard/Address/direccion_lista']);
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

  eliminarProductoDelCarrito(productId: string) {
    const producto = this.productosEnCarrito.find(prod => prod._id === productId);
    if (producto) {
      this.eliminarDelCarrito(producto);
      this.desconectarSocketSiCarritoVacio();
    }
  }

  eliminarDelCarrito(producto: any) {
    const index = this.productosEnCarrito.indexOf(producto);
    if (index !== -1) {
      this.productosEnCarrito.splice(index, 1);
      this.carritoService.eliminarDelCarrito(producto);
    }
  }

  desconectarSocketSiCarritoVacio() {
    if (this.productosEnCarrito.length === 0 && this.socketSubscription) {
      this.socketSubscription.unsubscribe();
      this.socketService.leaveRoom(this.clienteId);
      console.log('Socket desconectado porque el carrito está vacío');
    }
  }


  redirigirACompras() {
    this.router.navigate(['/dashboard/Shop/Tienda']);
  }

  vaciarCarrito(clienteId: string) {
    // Solo vaciar el carrito si se ha confirmado la compra
    if (this.estadoPago && this.estadoPago.status === 'approved') {
      localStorage.setItem('carrito', JSON.stringify(this.productosEnCarrito));
   //   this.carritoService.limpiarCarrito();
      this.desconectarSocketSiCarritoVacio();
    } else {
      console.log("El carrito no se vació porque la compra no está confirmada.");
    }
  }
  

  crearPedido(): Pedido {
    const direccionIdGuardada = this.adressService.obtenerDireccionSeleccionada();


    return {
      numero_Pedido: '${Date.now()}',
      cliente_id: this.clienteId,
      date_Pedido: new Date(),
      items: this.productosEnCarrito.map(producto => ({
        product_id: producto._id,
        title: producto.title,
        quantity: producto.cantidadSeleccionada,
        price: producto.price
      })),
      total_price: this.calcularTotal(),
      direccion_id: direccionIdGuardada || undefined
    };
  }

  continuarCompra() {
    const pedido: Pedido = this.crearPedido();

    this.mercadoPagoService.crearPreferencia(pedido).subscribe(
      response => {
        const redirectUrl = response.init_point;
        if (redirectUrl) {
          window.location.href = redirectUrl;
          this.verificarEstadoPago();
        } else {
          console.error('No se recibió una URL de redirección válida');
        }
      },
      error => {
        if (error.status === 400) {
          console.error('Error al crear la preferencia: Solicitud incorrecta. Verifica los datos enviados:', error.error);
        } else {
          console.error('Error inesperado:', error);
        }
      }
    );
  }

  redirigirADirecciones(): void {
    this.router.navigate(['/dashboard/Address/direccion_lista']);
  }

  obtenerCodigoPostal(): string {
    return localStorage.getItem('codigoPostal') || 'No disponible';
  }

  mostrarAlerta(mensaje: string) {
    alert(mensaje);
  }

  obtenerEstado(clienteId: string): void {
    this.mercadoPagoService.obtenerEstadoPago(clienteId).subscribe(
      (data) => {
        this.estadoPago = data;
        this.procesarEstadoPago(data);
      },
      (error) => {
        console.error('Error al obtener el estado de pago:', error);
      }
    );
  }

  procesarEstadoPago(data: any) {
    if (data.status === 'approved') {
      this.vaciarCarritoEnLocalStorage();
      alert('Pago aprobado');
    } else if (data.status === 'pending') {
      alert('Pago pendiente');
    } else if (data.status === 'rejected') {
      alert('Pago rechazado');
    }
  }

  verificarEstadoPago() {
    this.estadoPagoSubscription = interval(10000).subscribe(() => {
      this.mercadoPagoService.obtenerEstadoPago(this.clienteId).subscribe(
        (data) => {
          this.procesarEstadoPago(data);
          if (data.status === 'approved' || data.status === 'rejected') {
            this.estadoPagoSubscription?.unsubscribe();
          }
        },
        (error) => {
          console.error('Error al obtener el estado de pago:', error);
          this.estadoPagoSubscription?.unsubscribe();
        }
      );
    });
  }

  vaciarCarritoEnLocalStorage(): void {
    localStorage.removeItem('carrito');
  //  this.carritoService.limpiarCarrito();
    this.mostrarAlerta('El carrito ha sido eliminado después de una compra exitosa');
    this.router.navigate(['/dashboard']);
  }
  getImageUrl(imagePath: string | undefined): string {
    const baseUrl = `${environment.baseUrl}:${environment.port}/`;
    return `${baseUrl}${imagePath || ''}`;
  }


 
 
}
