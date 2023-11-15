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
  { path: 'admin-login', component: AdminLoginComponent },
 
  {
    path: 'registrar',
    component: RegistroComponent
  },

  {
    path: 'dashboard',
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./components/Productos/productos.module').then(m => m.ProductosModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
