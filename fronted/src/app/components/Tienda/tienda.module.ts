import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaRoutingModule } from './tienda-routing.module';
import { ArticulosComponent } from './articulos/articulos.component';
import { CarritoComprasComponent } from './carrito-compras/carrito-compras.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ArticulosComponent,
    CarritoComprasComponent
  ],
  imports: [
    CommonModule,
    TiendaRoutingModule,
    FormsModule
  ]
})
export class TiendaModule { }
