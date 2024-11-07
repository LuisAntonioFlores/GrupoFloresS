import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/interfaces/Producto';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { CarritoServiceService } from '../carrito-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss']
})
export class ArticulosComponent implements OnInit {

  productos: Producto[] = [];
  carrito: Producto[] = [];

  constructor(private productService: ProductSubirService, private router: Router, private carritoService: CarritoServiceService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (res: Producto[]) => {
        this.productos = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
  }

  estaEnCarrito(producto: Producto): boolean {
    const carrito = this.carritoService.obtenerCarrito();
    return carrito.some((item) => item._id === producto._id);
  }
  getImageUrl(imagePath: string | undefined): string {
    const baseUrl = `${environment.baseUrl}:${environment.port}/`;
    return `${baseUrl}${imagePath || ''}`;
  }
  
}
