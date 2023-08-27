import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// componentes
import {IniciarComponent } from './components/iniciar/iniciar.component';
import{PrivatetasksComponent} from './components/privatetasks/privatetasks.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PaginaWebInicialComponent } from './components/pagina-web-inicial/pagina-web-inicial.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
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
    path:'tareas',
    component: TareasComponent
  },
  {
    path:'iniciar',
    component: IniciarComponent
  },
 
  {
    path:'private',
    component: PrivatetasksComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'registrar',
    component:RegistroComponent
  },{ path: 'admin-login', component: AdminLoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
