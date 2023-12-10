import { Component } from '@angular/core';
import { ProductSubirService } from 'src/app/services/product-subir.service';
@Component({
  selector: 'app-subir-producto',
  templateUrl: './subir-producto.component.html',
  styleUrls: ['./subir-producto.component.scss']
})
export class SubirProductoComponent {
  file: File | null = null;
  photoSelected: string | ArrayBuffer | null = null;

  constructor(private productServe:ProductSubirService){  }

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

  uploadProduct(title: HTMLInputElement, description: HTMLTextAreaElement): boolean {
    if (this.file !== null) {
      this.productServe.createProduct(title.value, description.value, this.file)
        .subscribe(
          res => {
            console.log(res);
            // Puedes hacer algo más aquí después de una carga exitosa si es necesario
          },
          err => console.log(err)
        );
    } else {
      // Manejar el caso en el que this.file es null
      console.error("No se ha seleccionado ningún archivo.");
      // Puedes mostrar un mensaje de error al usuario o tomar otras acciones apropiadas.
    }
    return false;
  }
  
  
}
