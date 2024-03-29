import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// componentes adminitrador 
 import { SubirProductoComponent } from './subir-producto/subir-producto.component'; 
import { PreviewProductoComponent } from './preview-producto/preview-producto.component'; 
import { ListaProductoComponent } from './lista-producto/lista-producto.component';


const routes:Routes =[
  
  { path: 'list', component: ListaProductoComponent },
  { path: 'ProductoAlta', component: SubirProductoComponent  },
  { path: 'product/:id',component:PreviewProductoComponent},


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ],
  exports:[RouterModule] 
})
export class ProductosRoutingModule { }
