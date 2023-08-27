
import { Component, OnInit } from '@angular/core';
import { TareasService } from 'src/app/services/tareas.service';

interface Tarea {
  _id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  tareas: Tarea[] = [];

  constructor(private tareasService: TareasService) { }

  ngOnInit() {
    this.tareasService.getTarea().subscribe(
      (res: Tarea[]) => { // Asegurarse de que el servicio devuelva un array de tipo Tarea[]
        console.log(res);
        this.tareas = res;
      },
      (err) => console.log(err)
    );
  }
}

