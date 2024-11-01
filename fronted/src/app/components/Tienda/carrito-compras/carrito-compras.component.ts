import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoServiceService } from '../carrito-service.service';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/services/pedidos.service';
import { AuthService } from 'src/app/services/auth.service';
import { MercadoPagoService, Product } from 'src/app/services/mercado-pago.service';
import { Pedido } from 'src/app/interfaces/Pedidos';
import { AdressService } from '../../adress/adress.service';

import { Direccion } from 'src/app/interfaces/direccion';
import { Socket } from 'ngx-socket-io';
import { io } from 'socket.io-client';



@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.scss']
})
export class CarritoComprasComponent implements OnInit, OnDestroy {
  productosEnCarrito: any[] = [];
  carritoSubscription: Subscription | undefined;

  socket: any; 
  clienteId: string = '';
  direccion: string | null = null; //
  codigoPostal: string | null = null;
  direccionCompleta: Direccion | null = null;

  constructor(
    private carritoService: CarritoServiceService,
     private router: Router,
     private pedidoService: PedidoService,
     private authService: AuthService,
     private mercadoPagoService: MercadoPagoService,
     private adressService: AdressService,
     private socketService: Socket
     
    ) {this.socket = socketService; }

  ngOnInit() {
  // Conectar al servidor de Socket.IO
  try {
    this.socket = io('http://localhost:3000');
  } catch (error) {
    console.error('Error al conectar al socket:', error);
  }
  // Escuchar eventos de eliminación de productos
  this.socket.on('eliminarProducto', (productId: string) => {
    this.eliminarProductoDelCarrito(productId);
  });



    this.carritoSubscription = this.carritoService.carrito$.subscribe((productos) => {
      this.productosEnCarrito = productos;
    });

    this.clienteId = this.authService.getId() || '';
   //
  const direccionIdGuardada = this.adressService.obtenerDireccionSeleccionada();
// console.log('ID de dirección guardada:', direccionIdGuardada);

if (direccionIdGuardada) {
  this.adressService.obtenerDireccionPorId(direccionIdGuardada).subscribe(
    (direccion) => {
      if (direccion) {
        // Imprimir el ID de dirección y todos los demás datos
       // console.log('ID de dirección:', direccionIdGuardada);
        //console.log('Datos de dirección:', direccion); // Muestra todos los datos recibidos de la API
        
        // Asignar el código postal y otros campos según sea necesario
        this.codigoPostal = direccion.codigoPostal || 'Código postal no disponible';
        // console.log('Código postal:', this.codigoPostal);
        // Puedes asignar otros campos aquí también, por ejemplo:
        // this.calle = direccion.calle;
        // this.numero = direccion.numero;
      } else {
        this.codigoPostal = 'Código postal no disponible'; // Valor predeterminado
        // console.warn('No se encontró la dirección con el ID proporcionado.');
      }
    },
    (error) => {
      console.error('Error al obtener la dirección:', error);
    }
  );
}

//
 


  }



  ngOnDestroy() {
    if (this.carritoSubscription) {
        this.carritoSubscription.unsubscribe();
    }
    if (this.socket) {
        this.socket.off('pedidoPagado'); // Desuscribirse del evento
        this.socket.disconnect(); // Desconectar el socket
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

  eliminarProductoDelCarrito(productId: string) {
    const producto = this.productosEnCarrito.find(prod => prod._id === productId);
    if (producto) {
      this.eliminarDelCarrito(producto);
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
    const direccionIdGuardada = this.adressService.obtenerDireccionSeleccionada();
    return {
        numero_Pedido: '12345', // Puedes hacer este número dinámico
        cliente_id: this.clienteId , // Incluye el cliente_id aquí
        date_Pedido: new Date(),
        status: 'Pending',
        items: this.productosEnCarrito.map(producto => ({
            product_id: producto._id,
            title: producto.title,
            quantity: producto.cantidadSeleccionada,  // Asegúrate de usar cantidadSeleccionada
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
}