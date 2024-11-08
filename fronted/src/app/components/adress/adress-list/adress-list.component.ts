import { Component, OnInit } from '@angular/core';
import { AdressService } from '../adress.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adress-list',
  templateUrl: './adress-list.component.html',
  styleUrls: ['./adress-list.component.scss']
})
export class AdressListComponent implements OnInit {

  direcciones: any[] = []; // Variable para almacenar las direcciones del cliente
  direccionSeleccionada: string = ''; // Guardar la dirección seleccionada
  direccionGuardadaAutomaticamente: boolean = false;

  constructor(
    private authService: AuthService, 
    private addresServices: AdressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cliente_id = this.authService.getId(); // Obtener el cliente_id
  
    if (cliente_id) {
      // Llamar al servicio para obtener las direcciones
      this.addresServices.obtenerDirecciones(cliente_id).subscribe(
        data => {
          this.direcciones = data; // Asigna las direcciones obtenidas al arreglo
  
          // Verifica si ya hay una dirección guardada en localStorage
          const direccionGuardada = this.addresServices.obtenerDireccionSeleccionada();
          
          if (!direccionGuardada && this.direcciones.length > 0) {
            // Si no hay dirección guardada, selecciona la primera dirección automáticamente
            const primeraDireccionId = this.direcciones[0]._id;
            this.seleccionarDireccion(primeraDireccionId); // Seleccionar la primera dirección
            this.direccionGuardadaAutomaticamente = true;
            console.log('Primera dirección seleccionada automáticamente:', this.direcciones[0]);
          } else if (direccionGuardada) {
            // Si ya está seleccionada una dirección, la cargamos desde localStorage
            this.direccionSeleccionada = direccionGuardada;
            console.log('Dirección cargada desde localStorage:', direccionGuardada);
          }
        },
        error => {
          console.error('Error al obtener direcciones:', error);
        }
      );
    } else {
      console.error('cliente_id es nulo');
    }
  }
  
  
  seleccionarDireccion(direccionId: string): void {
    this.direccionSeleccionada = direccionId; 
    console.log('Dirección seleccionada:', direccionId);
    this.addresServices.guardarDireccionSeleccionada(direccionId); // Guarda en localStorage
    alert('Dirección guardada en localStorage');
  }
  
  agregarDireccion(): void {
    this.router.navigate(['/dashboard/Address/direccion_fom']);
  }

  getDireccionGuardadaStatus(): string {
    if (this.direccionGuardadaAutomaticamente) {
      return 'La primera dirección se ha guardado automáticamente.';
    } else if (this.direccionSeleccionada) {
      return 'Dirección seleccionada manualmente.';
    }
    return 'Esperando selección de dirección.';
  }
}
