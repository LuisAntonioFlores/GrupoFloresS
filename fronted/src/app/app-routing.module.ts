import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// componentes
import { PrivatetasksComponent } from './components/Seguridad/privatetasks/privatetasks.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { PaginaWebInicialComponent } from './components/Compartidos/pagina-web-inicial/pagina-web-inicial.component';

import { AdminLoginComponent } from './components/Seguridad/admin-login/admin-login.component';

import { AuthGuard } from './auth.guard';
import { SliderComponent } from './components/Compartidos/slider/slider.component';
import { BienvenidosComponent } from './components/Compartidos/bienvenidos/bienvenidos.component';
import { RegistrarComponent } from './components/Seguridad/registrar/registrar.component';
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
    path: 'slider', component: SliderComponent

  },
  {
    // Esta es la ruta para el componente PaginaWebInicialComponent en /bienvenidos
    path: 'bienvenido', component: BienvenidosComponent
  },
  {
    path: 'tareas',
    component: TareasComponent
  },
  {
    path: 'iniciar',
    component: AdminLoginComponent
  },
  {
    path: 'private',
    component: BienvenidosComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', 
  component: AdminLoginComponent 
  },
  {
    path: 'registrar',
    component: RegistrarComponent
  },
  {
    path: 'dashboard',
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./components/Productos/productos.module').then(m => m.ProductosModule),
        canActivate: [AuthGuard] 
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
