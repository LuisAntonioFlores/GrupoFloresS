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
  soloOferta: boolean = false; 
  carrito: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtro: string = '';
  constructor(private productService: ProductSubirService, private router: Router, private carritoService: CarritoServiceService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (res: Producto[]) => {
        this.productos = res;
        this.productosFiltrados = res;
        this.productos.forEach(producto => {
          producto.enOferta = producto.price < 12;
        });
      },
      (err) => {
        console.log(err);
      }
    );
    this.carrito = this.carritoService.obtenerCarrito();
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
    this.carrito = this.carritoService.obtenerCarrito(); 
  }

  estaEnCarrito(producto: Producto): boolean {
    const carrito = this.carritoService.obtenerCarrito();
    return carrito.some((item) => item._id === producto._id);
  }
  getImageUrl(imagePath: string | undefined): string {
    const baseUrl = `${environment.baseUrl}/`;
    // const baseUrl = `${environment.baseUrl}:${environment.port}/`;
    return `${baseUrl}${imagePath || ''}`;
  }
  filtrarProductos(): void {
    const filtro = this.filtro.toLowerCase();

    // Filtra los productos por el filtro de búsqueda y la opción de soloOferta
    this.productosFiltrados = this.productos.filter(producto => {
      const cumpleFiltro = 
        producto.title?.toLowerCase().includes(filtro) ||
        producto.price?.toString().includes(filtro) ||
        producto.quantity?.toString().includes(filtro) ||
        producto.description?.toLowerCase().includes(filtro);

      // Si soloOferta es verdadero, solo se incluyen productos en oferta
      return cumpleFiltro && (!this.soloOferta || producto.enOferta);
    });
  }
}
