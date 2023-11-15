import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductFormComponent } from './product-form/product-form.component';
import { SubirProductoComponent } from './subir-producto/subir-producto.component';
import { ListaProductoComponent } from './lista-producto/lista-producto.component';
import { PreviewProductoComponent } from './preview-producto/preview-producto.component';
import { ProductosRoutingModule } from './productos-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProductFormComponent,
    SubirProductoComponent,
    ListaProductoComponent,
    PreviewProductoComponent],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    RouterModule,FormsModule
  ],
  exports:[
    ListaProductoComponent,
  ]
})
export class ProductosModule { }
