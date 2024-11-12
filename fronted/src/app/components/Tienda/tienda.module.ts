import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaRoutingModule } from './tienda-routing.module';
import { ArticulosComponent } from './articulos/articulos.component';
import { CarritoComprasComponent } from './carrito-compras/carrito-compras.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagoExitosoComponent } from './pago-exitoso/pago-exitoso.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ArticulosComponent,
    CarritoComprasComponent,
    PagoExitosoComponent
  
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TiendaRoutingModule,
    FormsModule,
    NgbModule
  ]
})
export class TiendaModule { }
