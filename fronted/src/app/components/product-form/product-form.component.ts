import { Component } from '@angular/core';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  constructor(private productosService: ProductosService) {}

  product = {
    name: '',
    price: 0,
    description: '',
    image: null as File | null,
    cantidad: 0,
    imageURL: null as string | null // Asegúrate de agregar esta línea
  };

  submitForm() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('description', this.product.description);
    formData.append('cantidad', this.product.cantidad.toString());

    if (this.product.image) {
      formData.append('image', this.product.image);
    }

    this.productosService.agregarProducto(formData).subscribe(
      (response: any) => {
        console.log('Server response:', response);
        // Manejar la respuesta del servidor
      },
      (error: any) => {
        console.log('Server error:', error);
        // Manejar los errores
      }
    );
  }

  handleImageInput(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.product.image = file;
    } else {
      this.product.image = null;
    }
  }
}
