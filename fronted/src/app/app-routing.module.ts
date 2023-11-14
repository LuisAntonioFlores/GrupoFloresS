import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// componentes
import { IniciarComponent } from './components/Seguridad/iniciar/iniciar.component';
import { PrivatetasksComponent } from './components/Seguridad/privatetasks/privatetasks.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { RegistroComponent } from './components/Seguridad/registro/registro.component';
import { PaginaWebInicialComponent } from './components/pagina-web-inicial/pagina-web-inicial.component';
import { AdminLoginComponent } from './components/Seguridad/admin-login/admin-login.component';
import { AuthGuard } from './auth.guard';
// componentes adminitrador 

import { ListaProductoComponent } from './components/Productos/lista-producto/lista-producto.component';
import { SubirProductoComponent } from './components/Productos/subir-producto/subir-producto.component';
import { PreviewProductoComponent } from './components/Productos/preview-producto/preview-producto.component';
const routes: Routes = [
  {
    // Esta ruta redirige a /home como la ruta inicial
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    // Esta es la ruta para el componente PaginaWebInicialComponent en /home
    path: 'home', component: PaginaWebInicialComponent
  },
  {
    path: 'tareas',
    component: TareasComponent
  },
  {
    path: 'iniciar',
    component: IniciarComponent
  },

  {
    path: 'private',
    component: PrivatetasksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'registrar',
    component: RegistroComponent
  },
  // administrador
  
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'producto',
    component: ListaProductoComponent
  },
  {
    path: 'ProductoAlta',
    component: SubirProductoComponent
  },
  {
    path:'product/:id',
    component:PreviewProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
