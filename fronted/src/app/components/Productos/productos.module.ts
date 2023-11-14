import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductFormComponent } from './product-form/product-form.component';
import { SubirProductoComponent } from './subir-producto/subir-producto.component';
import { ListaProductoComponent } from './lista-producto/lista-producto.component';
import { PreviewProductoComponent } from './preview-producto/preview-producto.component';
import { ProductosRoutingModule } from './productos-routing.module';



@NgModule({
  declarations: [ProductFormComponent,
    SubirProductoComponent,
    ListaProductoComponent,
    PreviewProductoComponent],
  imports: [
    CommonModule,
    ProductosRoutingModule
  ]
})
export class ProductosModule { }
