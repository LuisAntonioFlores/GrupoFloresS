import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CompraComponent } from './compra/compra.component';


const routes: Routes = [
 
  {
    path: 'Compra',
    component: CompraComponent 
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
