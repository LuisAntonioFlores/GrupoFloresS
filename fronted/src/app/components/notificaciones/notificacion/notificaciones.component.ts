import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {
  notificaciones: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Escuchar el estado de pago
  }
  
}
