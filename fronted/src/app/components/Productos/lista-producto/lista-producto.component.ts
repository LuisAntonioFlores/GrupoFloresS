import { Component, OnInit } from '@angular/core';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { Producto } from 'src/app/interfaces/Producto';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.css']
})
export class ListaProductoComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productService: ProductSubirService) {}

  ngOnInit() {
    this.productService.getProducts() // Cambia de getProduct a getProducts
      .subscribe(
        (res: Producto[]) => {
          this.productos = res;
          console.log(this.productos);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  selectedCard(id:String){
  this.productService.getProducto(id)
  .subscribe(
    res =>console.log(res),
err=>console.log(err)
 )  
  }
}
