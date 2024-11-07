
import { Component, OnInit } from '@angular/core';
import { Informe, InformesContactoService } from 'src/app/services/informes-contacto.service';
import { TareasService } from 'src/app/services/tareas.service';

interface Tarea {
  _id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  informes: Informe[] = [];
  loading: boolean = true;

  // Tablas separadas para los diferentes estados
  atendidos: Informe[] = [];
  enProceso: Informe[] = [];
  noAtendidos: Informe[] = [];

  constructor(private informesContactoService: InformesContactoService) { }

  ngOnInit(): void {
    this.obtenerInformes();
  }

  obtenerInformes(): void {
    this.informesContactoService.obtenerInformes().subscribe(
      (informes) => {
        // Ordenar los informes por fecha
        this.informes = informes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        // Separar los informes en las tres categorías
        this.atendidos = informes.filter(informe => informe.estado === 'atendido');
        this.enProceso = informes.filter(informe => informe.estado === 'en_proceso');
        this.noAtendidos = informes.filter(informe => informe.estado === 'no_atendido');

        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los informes:', error);
        this.loading = false;
      }
    );
  }

 cambiarEstado(informe: Informe, estado: 'atendido' | 'en_proceso' | 'no_atendido'): void {
  // Validar el estado antes de asignarlo
  if (['atendido', 'en_proceso', 'no_atendido'].includes(estado)) {
    informe.estado = estado;

    // Actualiza el estado en el backend
    this.informesContactoService.actualizarEstadoInforme(informe._id, estado).subscribe(() => {
      // Actualizar las tablas después de cambiar el estado
      this.atendidos = this.informes.filter(informe => informe.estado === 'atendido');
      this.enProceso = this.informes.filter(informe => informe.estado === 'en_proceso');
      this.noAtendidos = this.informes.filter(informe => informe.estado === 'no_atendido');
    });
  } else {
    console.error('Estado inválido');
  }
}

}

