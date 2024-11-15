import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasRoutingModule } from './compras-routing.module';
import { CompraComponent } from './compra/compra.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    CompraComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    FormsModule,
    NgbModule
  ]
})
export class ComprasModule { }
