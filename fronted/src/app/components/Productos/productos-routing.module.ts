import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// componentes adminitrador import { ListaProductoComponent } from './lista-producto/lista-producto.component';
import { SubirProductoComponent } from './subir-producto/subir-producto.component'; 
import { PreviewProductoComponent } from './preview-producto/preview-producto.component'; 
import { ListaProductoComponent } from './lista-producto/lista-producto.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes:Routes =[
  
  { path: 'Lista-P', component: ListaProductoComponent },
  { path: 'ProductoAlta', component: SubirProductoComponent  },
  { path: 'product/:id',component:PreviewProductoComponent},
  { path: 'producto', component: ProductFormComponent },
 

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ],
  exports:[RouterModule] 
})
export class ProductosRoutingModule { }
