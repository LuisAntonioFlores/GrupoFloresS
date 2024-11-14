import { Component, OnInit } from '@angular/core';
 // Ajusta la ruta si es necesario
import { Pedido } from 'src/app/interfaces/Pedidos'; // Ajusta la ruta si es necesario
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedidos.service';
import { AdressService } from '../../adress/adress.service';
import { Direccion } from 'src/app/interfaces/direccion';
import { Router } from '@angular/router';
@Component({
  selector: 'app-compra',
   templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent implements OnInit {
  pedidos: Pedido[] = []; // Aquí almacenaremos los pedidos del cliente
  showModal: boolean = false; // Para controlar si el modal está visible
  selectedPedido: Pedido | null = null; // Para almacenar el pedido seleccionado
  direccionCompleta: string = '';
  mensajeError: string | null = null;

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private addressService:AdressService,
    private router: Router) { }

  ngOnInit(): void {
    const clienteId = this.authService.getId()||''; // Reemplaza con el ID del cliente o lo que sea dinámico

    this.pedidoService.getPedidos(clienteId).subscribe(
      (resultado) => {
        if (Array.isArray(resultado)) {
          // Si resultado es un array, significa que tenemos pedidos
          this.pedidos = resultado;
          this.mensajeError = null; // Resetea el mensaje de error si hay pedidos
        } else if (resultado.message) {
          // Si resultado tiene un mensaje, es un mensaje de error
          this.mensajeError = resultado.message;
          this.pedidos = []; // Aseguramos que la lista de pedidos esté vacía
        }
      },
      (error) => {
        console.error('Error al obtener los pedidos:', error);
        this.mensajeError = 'Ocurrió un error al obtener los pedidos.';
      }
    );
  }

  viewDetails(numeroPedido: string): void {
    //console.log('Ver detalles del pedido', numeroPedido);
    // Aquí obtenemos los detalles del pedido y mostramos el modal
    this.pedidoService.getPedido(numeroPedido).subscribe(
      (pedido: Pedido) => {
        this.selectedPedido = pedido; 
        if (pedido.direccion_id) {
          // Si el pedido tiene una dirección asociada, la obtenemos
          this.addressService.obtenerDireccionPorId(pedido.direccion_id).subscribe(
            (direccion: Direccion) => {
              // Combinamos los datos de la dirección en un solo párrafo
              this.direccionCompleta = `${direccion.calle} ${direccion.numero}, ${direccion.colonia}, ${direccion.municipio}, ${direccion.estado}, ${direccion.codigoPostal},${direccion.descripcion}`;
         },
            (error) => {
              console.error('Error al obtener la dirección:', error);
            }
          );
        }
        this.showModal = true; // Mostramos el modal
      },
      (error) => {
        console.error('Error al obtener los detalles del pedido:', error);
      }
    );
  }

  closeModal(): void {
    this.showModal = false; // Cerramos el modal
    this.selectedPedido = null; // Limpiamos la información del pedido seleccionado
    this.direccionCompleta = '';
    
  }
}
