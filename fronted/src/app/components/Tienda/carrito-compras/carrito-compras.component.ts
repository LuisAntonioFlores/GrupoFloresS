import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoServiceService } from '../carrito-service.service';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/services/pedidos.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.scss']
})
export class CarritoComprasComponent implements OnInit, OnDestroy {
  productosEnCarrito: any[] = [];
  carritoSubscription: Subscription | undefined;

 clienteId: string = '';

  
  constructor(private carritoService: CarritoServiceService, private router: Router,private pedidoService: PedidoService,private authService: AuthService  ) { }

  ngOnInit() {
    this.carritoSubscription = this.carritoService.carrito$.subscribe((productos) => {
      this.productosEnCarrito = productos;
    });

    // Suscripción al userData$ para obtener el _id del usuario
    this.authService.userData$.subscribe((userData) => {
      this.clienteId = userData._id || '';
      console.log(`p_Id: ${userData._id}`);
      console.log('p2_Id: ' + userData._id);


      console.log('cliente',this.clienteId);
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
    
    crearPedido() {
      // Aquí puedes construir el objeto pedido con los datos necesarios, por ejemplo:
      const pedidoData = {
         numero_Pedido: '12345',
        cliente_id: this.clienteId, // Reemplaza 'id_del_cliente' con el ID del cliente real
        items: this.productosEnCarrito.map(producto => ({
          product_id: producto._id,
          quantity: producto.cantidadSeleccionada,
          price: producto.price
        })),
        total_price: this.calcularTotal()
      };
      
    
      // Llama al método createPedido del servicio PedidoService
      this.pedidoService.createPedido(pedidoData).subscribe(
        response => {
          console.log('Pedido creado exitosamente:', response);
          // Puedes redirigir al usuario a una página de confirmación o realizar otras acciones aquí
        },
        error => {
          console.error('Error al crear el pedido:', error);
          // Maneja el error adecuadamente, por ejemplo, mostrando un mensaje al usuario
        }
      );
    }
    
}