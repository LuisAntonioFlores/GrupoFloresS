import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/interfaces/Producto';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { CarritoServiceService } from '../carrito-service.service';
@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss']
})
export class ArticulosComponent implements OnInit {

  productos: Producto[] = [];
  carrito: Producto[] = [];
  productosAgregados: Set<string> = new Set<string>(); 

  constructor(private productService: ProductSubirService, private router:Router, private carritoService:CarritoServiceService){

  }
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

  agregarAlCarrito(producto: Producto): void {
    // Llamamos al método del servicio que se encarga de agregar al carrito
    this.carritoService.agregarAlCarrito(producto);
  }
  
  estaEnCarrito(producto: Producto): boolean {
    const carrito = this.carritoService.obtenerCarrito();
    return carrito.some((item) => item._id === producto._id);
  }
  
  
}
