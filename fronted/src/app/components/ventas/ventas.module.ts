import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas/ventas.component';



@NgModule({
  declarations: [VentasComponent],
  imports: [
    CommonModule,
    VentasRoutingModule
  ],
  exports: [VentasComponent]
})
export class VentasModule { }
