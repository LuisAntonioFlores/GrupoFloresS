import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas/ventas.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [VentasComponent],
  imports: [
    CommonModule,
    VentasRoutingModule,
    FormsModule
  ],
  exports: [VentasComponent]
})
export class VentasModule { }
