import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/interfaces/Pedidos';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedidos.service';
import { AdressService } from '../../adress/adress.service';
import { Direccion } from 'src/app/interfaces/direccion';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  pedidos: Pedido[] = [];
  errorMessage: string = '';
  clienteNombres: { [clienteId: string]: string } = {}; // Objeto para almacenar nombres de clientes
  direccionCompleta: Direccion | null = null;
  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService, private adressService: AdressService

  ) { }

  ngOnInit(): void {
    this.getAllPedidos();
  }

  getAllPedidos(): void {
    this.pedidoService.getAllPedidos().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.pedidos = response.data.map((pedido) => {
            if (pedido.createdAt) {
              pedido.createdAt = new Date(pedido.createdAt);  // Convierte la fecha a objeto Date
            }
  
            // Obtén la dirección de este pedido (dirección específica por pedido)
            const direccionId = pedido.direccion_id; // Aquí obtenemos el direccion_id del pedido
  
            if (direccionId) {
              this.obtenerDireccionCompleta(direccionId); // Llamamos al método que consulta la dirección
            }
  
            if (pedido.cliente_id) {
              // Verificar si ya se ha cargado el nombre para este cliente
              if (!this.clienteNombres[pedido.cliente_id]) {
                this.authService.getNombrePorId(pedido.cliente_id).subscribe({
                  next: (authResponse) => {
                    // Almacenar el nombre completo en el objeto
                    this.clienteNombres[pedido.cliente_id] = authResponse.nombreCompleto;
                  },
                  error: (err) => {
                    console.error(
                      `Error al obtener el nombre para el cliente ${pedido.cliente_id}:`,
                      err
                    );
                    this.clienteNombres[pedido.cliente_id] = 'Nombre no disponible'; // Valor predeterminado
                  },
                });
              }
            }
  
            return pedido;
          });
          console.log('Pedidos procesados con fecha:', this.pedidos);
        }
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron obtener los pedidos';
        console.error('Error al obtener los pedidos:', err);
      }
    });
  }
  
  

  // Método para obtener el nombre de cliente basado en el cliente_id
  getClienteNombre(clienteId: string): string {
    return this.clienteNombres[clienteId] || 'Cargando...';
  }
  obtenerDireccionCompleta(direccionId: string): void {
    this.adressService.obtenerDireccionPorId(direccionId).subscribe({
      next: (direccion) => {
        console.log('Dirección completa obtenida:', direccion);
        this.direccionCompleta = direccion; // Guarda la dirección en la propiedad
      },
      error: (err) => {
        console.error('Error al obtener la dirección:', err);
      }
    });
  }
  
}
