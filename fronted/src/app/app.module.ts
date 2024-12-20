import { NgModule, isDevMode } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { PrivatetasksComponent } from './components/Seguridad/privatetasks/privatetasks.component';
import { ErrorModalComponent } from './components/Seguridad/error-modal/error-modal.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { CommonModule } from '@angular/common';
import { PaginaWebInicialComponent } from './components/Compartidos/pagina-web-inicial/pagina-web-inicial.component';
import { DropdownMenuComponent } from './components/Compartidos/dropdown-menu/dropdown-menu.component';
import { BottomBarComponent } from './components/Compartidos/bottom-bar/bottom-bar.component';
import { AdminLoginComponent } from './components/Seguridad/admin-login/admin-login.component';
import { MapComponent } from './components/Compartidos/map/map.component';
import { SliderComponent } from './components/Compartidos/slider/slider.component';
import { SidebarComponent } from './components/Compartidos/sidebar/sidebar.component';
import { FooterComponent } from './components/Compartidos/footer/footer.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductosModule } from './components/Productos/productos.module';
import { MaterialModule } from './moduls/material/material.module';
import { BienvenidosComponent } from './components/Compartidos/bienvenidos/bienvenidos.component';
import { OnepageComponent } from './components/Compartidos/onepage/onepage.component';
import { NavonepageComponent } from './components/Compartidos/onepage/navonepage/navonepage.component';
import { RegistrarComponent } from './components/Seguridad/registrar/registrar.component';
import { ContactoComponent } from './components/Compartidos/contacto/contacto.component';
import { AuthService } from './services/auth.service';
import { TiendaModule } from './components/Tienda/tienda.module';
import { AdressModule } from './components/adress/adress.module';
import { SocketService } from './services/socket.service';
import { SeguridadModule } from './components/Segurity/seguridad.module';
import { ComprasModule } from './components/compras/compras.module';
import { NotificacionModule } from './components/notificaciones/notificacion.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { VerificationComponent } from './components/Segurity/verification/verification.component';
import { RecuperarContrasenaComponent } from './components/Seguridad/recuperar-contrasena/recuperar-contrasena.component';
import { CambiarContrasenaComponent } from './components/Seguridad/cambiar-contrasena/cambiar-contrasena.component';
import { VentasModule } from './components/ventas/ventas.module';



@NgModule({
  declarations: [
    AppComponent,
    TareasComponent,
    PrivatetasksComponent,
    ErrorModalComponent,
    PaginaWebInicialComponent,
    DropdownMenuComponent,
    BottomBarComponent,
    AdminLoginComponent,
    MapComponent,
    SliderComponent,
    FooterComponent,
    SidebarComponent,
    BienvenidosComponent,
    OnepageComponent,
    NavonepageComponent,
    RegistrarComponent,
    ContactoComponent,
    VerificationComponent,
    RecuperarContrasenaComponent,
    CambiarContrasenaComponent
    




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgbModalModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ProductosModule,
    MaterialModule,
    TiendaModule,
    AdressModule,
  SeguridadModule,
  ComprasModule,
  NotificacionModule,
  VentasModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: !isDevMode(),
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  })
],
  providers: [
    SocketService,
    AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
