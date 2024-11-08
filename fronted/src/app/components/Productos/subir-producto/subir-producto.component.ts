import { Component } from '@angular/core';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subir-producto',
  templateUrl: './subir-producto.component.html',
  styleUrls: ['./subir-producto.component.scss']
})
export class SubirProductoComponent {
  file: File | null = null;
  photoSelected: string | ArrayBuffer | null = null;

  constructor(private productServe: ProductSubirService, private router: Router) { }

  onPhotoSelect(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const inputElement = event.target;
      if (inputElement.files && inputElement.files[0]) {
        this.file = inputElement.files[0];
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target && e.target.result) {
            this.photoSelected = e.target.result;
          }
        };
        reader.readAsDataURL(this.file);
      }
    }
  }

  uploadProduct(titleSelect: HTMLSelectElement, description: HTMLTextAreaElement, priceInput: HTMLInputElement, quantityInput: HTMLInputElement): boolean {
    if (this.file !== null) {
      const price = parseFloat(priceInput.value);
      const quantity = parseInt(quantityInput.value, 10);

      if (isNaN(price) || isNaN(quantity)) {
        console.error("El precio o la cantidad no son números válidos.");
        return false;
      }

      this.productServe.createProduct(titleSelect.value, description.value, price, quantity, this.file)
        .subscribe(
          res => {
           // console.log(res);
            this.router.navigate(['/dashboard/admin/list']);
          },
          err => console.log(err)
        );
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
    return false;
  }

  
}
