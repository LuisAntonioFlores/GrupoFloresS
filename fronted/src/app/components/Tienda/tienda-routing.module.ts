import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArticulosComponent } from './articulos/articulos.component';
import { CarritoComprasComponent } from './carrito-compras/carrito-compras.component';
import { PagoExitosoComponent } from './pago-exitoso/pago-exitoso.component';

const routes:Routes =[
  
  { path: 'Tienda', component: ArticulosComponent },
  { path: 'Carrito', component: CarritoComprasComponent },
  { path: 'Exito', component: PagoExitosoComponent },
  
  


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class TiendaRoutingModule { }
