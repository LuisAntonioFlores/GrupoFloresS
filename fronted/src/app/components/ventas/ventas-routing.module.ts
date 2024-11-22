import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas/ventas.component';

const routes: Routes = [
  // Aquí defines las rutas de tu módulo de ventas
  // Por ejemplo:
   { path: 'Venta', component: VentasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule {}
