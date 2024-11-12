import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { UserPerfilComponent } from './user-perfil/user-perfil.component';



@NgModule({
  declarations: [
    UserPerfilComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    NgbModule,
    ReactiveFormsModule
    
  ]
})
export class SeguridadModule { }
