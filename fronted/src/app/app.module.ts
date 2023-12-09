import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IniciarComponent } from './components/Seguridad/iniciar/iniciar.component';

import { TareasComponent } from './components/tareas/tareas.component';
import { PrivatetasksComponent } from './components/Seguridad/privatetasks/privatetasks.component';

import { RegistroComponent } from './components/Seguridad/registro/registro.component';

import { ErrorModalComponent } from './components/Seguridad/error-modal/error-modal.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { CommonModule } from '@angular/common';
import { PaginaWebInicialComponent } from './components/pagina-web-inicial/pagina-web-inicial.component';
import { DropdownMenuComponent } from './components/Compartidos/dropdown-menu/dropdown-menu.component';
import { BottomBarComponent } from './components/Compartidos/bottom-bar/bottom-bar.component';
import { AdminLoginComponent } from './components/Seguridad/admin-login/admin-login.component';
import { MapComponent } from './components/map/map.component';



import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProductosModule } from './components/Productos/productos.module';
import { FooterComponent } from './components/Compartidos/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaterialModule } from './moduls/material/material.module';


@NgModule({
  declarations: [
    AppComponent,
    IniciarComponent,
    TareasComponent,
    PrivatetasksComponent,
    RegistroComponent,
    ErrorModalComponent,
    PaginaWebInicialComponent,
    DropdownMenuComponent,
    BottomBarComponent,
    AdminLoginComponent,
    MapComponent,
    SliderComponent,
    FooterComponent,
    SidebarComponent
    
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
    // modulos de la aplicacion
    ProductosModule,
    MaterialModule,

  ],
  providers: [
    AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
