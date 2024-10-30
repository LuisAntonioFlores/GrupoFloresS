import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressRoutingModule } from './address-routing.module';

import { FormAdressComponent } from './form-adress/form-adress.component';
import { AdressListComponent } from './adress-list/adress-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AdressListComponent,
     FormAdressComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddressRoutingModule,
    FormsModule
  ]
})
export class AdressModule { }
