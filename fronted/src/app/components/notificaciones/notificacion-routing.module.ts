import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificacionesComponent } from './notificacion/notificaciones.component';

const routes:Routes =[
  
  { path: 'Notificar', component: NotificacionesComponent },
  

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ], exports:[RouterModule]
})
export class NotificacionRoutingModule { }
