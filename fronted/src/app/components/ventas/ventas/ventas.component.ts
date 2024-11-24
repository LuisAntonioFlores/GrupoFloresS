import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/interfaces/Pedidos';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedidos.service';
import { AdressService } from '../../adress/adress.service';
import { Direccion } from 'src/app/interfaces/direccion'; // Importar la interfaz Direccion

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  pedidos: Pedido[] = [];
  errorMessage: string = '';
  clienteNombres: { [clienteId: string]: string } = {}; // Objeto para almacenar nombres de clientes
  direccionesPorPedido: { [pedidoId: string]: Direccion } = {}; // Almacenar direcciones por pedido
  loadingDireccion: { [pedidoId: string]: boolean } = {}; // Para controlar el estado de carga por pedido
  selectedPedido: Pedido | undefined = undefined;
  // selectedPedido: Pedido | null = null; // Almacena el pedido seleccionado
showModal: boolean = false; // Controla la visibilidad del modal



  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService, 
    private adressService: AdressService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllPedidos();
  }

  getAllPedidos(): void {
    this.pedidoService.getAllPedidos().subscribe({
      next: (response) => {
        if (response && response.data) {
          // console.log('Respuesta de la API:', response);
          // console.log('Datos de pedidos:', response.data);
          this.pedidos = response.data;
          this.pedidos.forEach((pedido) => {
            // Verificar que _id y direccion_id estén definidos antes de llamar a obtenerDireccionCompleta
            if (pedido._id && pedido.direccion_id) {
              this.obtenerDireccionCompleta(pedido.direccion_id, pedido._id);
            }

            // Obtener el nombre del cliente si no está cargado
            if (pedido.cliente_id && !this.clienteNombres[pedido.cliente_id]) {
              this.authService.getNombrePorId(pedido.cliente_id).subscribe({
                next: (authResponse) => {
                  if (authResponse && authResponse.nombreCompleto) {
                    this.clienteNombres[pedido.cliente_id] = authResponse.nombreCompleto;
                  } else {
                    this.clienteNombres[pedido.cliente_id] = 'Nombre no disponible';
                  }
                },
                error: (err) => {
                  console.error(`Error al obtener el nombre para el cliente ${pedido.cliente_id}:`, err);
                  this.clienteNombres[pedido.cliente_id] = 'Nombre no disponible';
                }
              });
            }
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron obtener los pedidos';
        console.error('Error al obtener los pedidos:', err);
      }
    });
  }

  obtenerDireccionCompleta(direccionId: string, pedidoId: string): void {
    this.loadingDireccion[pedidoId] = true;  // Marca como cargando
    this.adressService.obtenerDireccionPorId(direccionId).subscribe({
      next: (direccion) => {
        // console.log('Dirección obtenida:', direccion);
        this.direccionesPorPedido[pedidoId] = direccion;
        this.loadingDireccion[pedidoId] = false;  // Marca como cargado
      },
      error: (err) => {
        console.error('Error al obtener la dirección:', err);
        this.loadingDireccion[pedidoId] = false;  // Marca como cargado con error
      }
    });
  }

  // Método para obtener el nombre de cliente basado en el cliente_id
  getClienteNombre(clienteId: string): string {
    return this.clienteNombres[clienteId] || 'Nombre no disponible';
  }

  obtenerDireccionDePedido(pedidoId: string): Direccion | null {
    return this.direccionesPorPedido[pedidoId] || null;
  }

 viewDetails(pedido: Pedido): void {
  if (pedido._id) { // Asegúrate de que _id no es undefined
    // console.log('Pedido seleccionado:', pedido);
    this.selectedPedido = pedido;
    this.showModal = true;
  } else {
    console.warn('El pedido no tiene un ID válido.');
  }
}

  
  // Método para cerrar el modal
  closeModal(): void {
    this.showModal = false;
    this.selectedPedido = undefined; // Limpia el pedido seleccionado
  }
  get hasItems(): boolean {
    return !!this.selectedPedido?.items?.length;
  }
  
 
  
  updatePedido(pedidoNumero: string, estado: string): void {
    if (!pedidoNumero || !estado) {
      console.warn('No se proporcionaron valores válidos para actualizar el pedido.');
      return;
    }
  
    const updateData = { estado_entrega: estado };
  
    this.pedidoService.updatePedido(pedidoNumero, updateData).subscribe({
      next: (response) => {
        // console.log('Pedido actualizado:', response);
        // Aquí puedes agregar la lógica para actualizar la lista de pedidos o realizar otras acciones
      },
      error: (err) => {
        this.errorMessage = 'No se pudo actualizar el pedido';
        console.error('Error al actualizar el pedido:', err);
      }
    });
  }
  
  
  }


  

