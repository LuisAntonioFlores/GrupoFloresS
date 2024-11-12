import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserPerfilComponent } from './user-perfil/user-perfil.component';

const routes:Routes =[
  
  { path: 'User', component: UserPerfilComponent },
  
  


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ], exports:[RouterModule]
})
export class SeguridadRoutingModule { }
