import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// componentes
import { TareasComponent } from './components/tareas/tareas.component';
import { PaginaWebInicialComponent } from './components/Compartidos/pagina-web-inicial/pagina-web-inicial.component';

import { AdminLoginComponent } from './components/Seguridad/admin-login/admin-login.component';

import { AuthGuard } from './auth.guard';
import { SliderComponent } from './components/Compartidos/slider/slider.component';
import { BienvenidosComponent } from './components/Compartidos/bienvenidos/bienvenidos.component';
import { RegistrarComponent } from './components/Seguridad/registrar/registrar.component';
import { VerificationComponent } from './components/Segurity/verification/verification.component';
import { RecuperarContrasenaComponent } from './components/Seguridad/recuperar-contrasena/recuperar-contrasena.component';
import { CambiarContrasenaComponent } from './components/Seguridad/cambiar-contrasena/cambiar-contrasena.component';

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
    path: 'verificacion', component: VerificationComponent

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
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent },
  {
    path: 'dashboard',
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./components/Productos/productos.module').then(m => m.ProductosModule),
        canActivate: [AuthGuard] 
      }, {
        path: 'Shop',
        loadChildren: () => import('./components/Tienda/tienda.module').then(m => m.TiendaModule),
        canActivate: [AuthGuard] 
      },
      {
        path: 'Address',
        loadChildren: () => import('./components/adress/adress.module').then(m => m.AdressModule),
        canActivate: [AuthGuard] 
      },
      
      {
        path: 'Perfil',
        loadChildren: () => import('./components/Segurity/seguridad.module').then(m => m.SeguridadModule),
        canActivate: [AuthGuard] 
      },
      {
        path: 'Compras',
        loadChildren: () => import('./components/compras/compras.module').then(m => m.ComprasModule),
        canActivate: [AuthGuard] 
      },
      {
        path: 'Ventas',
        loadChildren: () => import('./components/ventas/ventas.module').then(m => m.VentasModule),
        canActivate: [AuthGuard] 
      },
      {
        path: 'Notificacion',
        loadChildren: () => import('./components/notificaciones/notificacion.module').then(m => m.NotificacionModule),
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
