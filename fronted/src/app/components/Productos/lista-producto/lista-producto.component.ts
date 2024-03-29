import { Component, OnInit } from '@angular/core';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { Producto } from 'src/app/interfaces/Producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.scss']
})
export class ListaProductoComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productService: ProductSubirService, private router:Router) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (res: Producto[]) => {
        this.productos = res;
        console.log(this.productos);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectedCard(id: String) {
    this.router.navigate(['dashboard/admin/product',id ]);
  }
}