import { Component, OnInit } from '@angular/core';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { Producto } from 'src/app/interfaces/Producto';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.scss']
})
export class ListaProductoComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productService: ProductSubirService, private router:Router) { }
 // private apiUrl = `${environment.baseUrl}:${environment.port}/`; // URL dinámica para la API

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (res: Producto[]) => {
        this.productos = res;
       // console.log(this.productos);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectedCard(id: String) {
    this.router.navigate(['dashboard/admin/product',id ]);
  }
  getImageUrl(imagePath: string | undefined): string {
    // const baseUrl = `${environment.baseUrl}:${environment.port}/`;
    const baseUrl = `${environment.baseUrl}/`;
    return `${baseUrl}${imagePath || ''}`;
  }
  
}