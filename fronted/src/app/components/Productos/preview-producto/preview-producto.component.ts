import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { Producto } from 'src/app/interfaces/Producto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preview-producto',
  templateUrl: './preview-producto.component.html',
  styleUrls: ['./preview-producto.component.scss']
})
export class PreviewProductoComponent implements OnInit {
  private apiUrl = `${environment.baseUrl}:${environment.port}/`; // URL dinámica para la API


  id: string = '';
  producto: Producto | undefined;

  constructor(
    private router: Router,
    private activeroute: ActivatedRoute,
    private productSevices: ProductSubirService
  ) { }

  ngOnInit() {
    this.activeroute.params.subscribe(params => {
      this.id = params['id'];
      this.productSevices.getProducto(this.id)
        .subscribe(
          res => {
            this.producto = res;
          },
          err => console.log(err)
        );
    });
  }

  deleteProducto(id: string | undefined): void {
    if (id) {
      this.productSevices.deleteProducto(id)
        .subscribe(
          res => {
            console.log(res);
            this.router.navigate(['/dashboard/admin/list']);
          },
          err => console.log(err)
        );
    }
  }

  updateProducto(
    title: HTMLInputElement,
    description: HTMLTextAreaElement,
    price: HTMLInputElement,
    quantity: HTMLInputElement,
    addPiecesInput: HTMLInputElement,
    enOfertaCheckbox: HTMLInputElement // Nuevo parámetro para el checkbox
  ): void {
    if (this.id && this.producto) {
      const updatedTitle = title.value;
      const updatedDescription = description.value;
      const updatedPrice = parseFloat(price.value);
      const updatedQuantity = parseInt(quantity.value, 10);
      const addPieces = parseInt(addPiecesInput.value, 10);
      const enOferta = enOfertaCheckbox.checked; // Obtener el valor de enOferta
  
      if (updatedTitle && updatedDescription && !isNaN(updatedPrice) && !isNaN(updatedQuantity) && !isNaN(addPieces)) {
        this.productSevices.uptdateProducto(this.id, updatedTitle, updatedDescription, updatedPrice, updatedQuantity + addPieces, enOferta)
          .subscribe(
            res => {
              console.log(res);
              this.router.navigate(['/dashboard/admin/list']);
            },
            err => console.log(err)
          );
      } else {
        console.error("Error: Asegúrate de completar todos los campos correctamente.");
      }
    }
  }
  
  getImageUrl(imagePath: string | undefined): string {
    const baseUrl = `${environment.baseUrl}:${environment.port}/`; // URL base desde el entorno

    // Asegura que hay una barra entre baseUrl e imagePath
    return `${baseUrl}${imagePath?.startsWith('/') ? imagePath.slice(1) : imagePath || ''}`;
}

}
