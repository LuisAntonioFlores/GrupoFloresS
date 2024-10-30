import { Component, OnInit } from '@angular/core';
import { AdressService } from '../adress.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adress-list',
  templateUrl: './adress-list.component.html',
  styleUrls: ['./adress-list.component.scss']
})
export class AdressListComponent implements OnInit {

  direcciones: any[] = []; // Variable para almacenar las direcciones del cliente
  direccionSeleccionada: string = '';
  // Cambiado a solo string

  constructor(private authService: AuthService, 
    private addresServices: AdressService, ) {}
  ngOnInit(): void {
    const cliente_id = this.authService.getId(); // Aquí colocas el cliente_id

    if (cliente_id) {
      // Llamar al servicio para obtener las direcciones
      this.addresServices.obtenerDirecciones(cliente_id).subscribe(
        data => {
          this.direcciones = data; // Asigna las direcciones obtenidas al arreglo
          // console.log('Direcciones:', this.direcciones); // Verificar en consola
          },
        error => {
          console.error('Error al obtener direcciones:', error); // Manejo de error
        }
      );
    } else {
      console.error('cliente_id es nulo'); // Manejo de caso cuando cliente_id es nulo
    }
    const direccionGuardada = this.addresServices.obtenerDireccionSeleccionada();
    if (direccionGuardada) {
      this.direccionSeleccionada = direccionGuardada;
    }
  }
  seleccionarDireccion(direccionId: string): void {
    this.direccionSeleccionada = direccionId; 
    console.log('Dirección seleccionada:', direccionId);
    this.addresServices.guardarDireccionSeleccionada(direccionId); 
    alert('Dirección guardada en localStorage');
  }

}
