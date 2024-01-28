import { Component } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  constructor(private productosService: ProductosService,
     private router: Router,
     private route: ActivatedRoute) { }

  product = {
    name: '',
    price: 0,
    description: '',
    image: null as File | null,
    cantidad: 0,
    imageURL: null as string | null // Asegúrate de agregar esta línea
  };

 
  
    // ... (código anterior)

submitForm() {
  console.log('Formulario enviado');
  console.log('Before FormData creation');
  const formData = new FormData();
  formData.append('name', this.product.name);
  formData.append('price', this.product.price.toString());
  formData.append('description', this.product.description);
  formData.append('cantidad', this.product.cantidad.toString());

  if (this.product.image) {
    formData.append('image', this.product.image);
  }

  console.log('Before agregarProducto');
  this.productosService.agregarProducto(formData).subscribe(
    (response: any) => {
      console.log('Successful response:', response);

      // Redirigir a la página deseada después de enviar el formulario con éxito
      this.router.navigate(['/ruta-deseada']); // Reemplaza '/ruta-deseada' con tu ruta real

    },
    (error: any) => {
      console.log('Server error:', error);
    }
  );
}
// ... (código posterior)

  

  handleImageInput(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.product.image = file;
    } else {
      this.product.image = null;
    }
  }
}
