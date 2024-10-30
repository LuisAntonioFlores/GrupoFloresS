import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FormAdressComponent } from './form-adress/form-adress.component';
import { AdressListComponent } from './adress-list/adress-list.component';

const routes: Routes = [
  { path: 'direccion_fom', component: FormAdressComponent },
  { path: 'direccion_lista', component: AdressListComponent },
  

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ], 
  exports: [RouterModule]
})
export class AddressRoutingModule { }
