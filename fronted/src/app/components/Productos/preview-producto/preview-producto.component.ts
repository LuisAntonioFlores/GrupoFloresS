import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductSubirService } from 'src/app/services/product-subir.service';
import { Producto } from 'src/app/interfaces/Producto';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-producto',
  templateUrl: './preview-producto.component.html',
  styleUrls: ['./preview-producto.component.scss']
})
export class PreviewProductoComponent implements OnInit {

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

  updateProducto(title: HTMLInputElement, description: HTMLTextAreaElement) {
    this.productSevices.uptdateProducto(this.id, title.value, description.value)
      .subscribe(
        res => {
          console.log(res)
          this.router.navigate(['/dashboard/admin/list'])
        },
        err => console.log(err)
      )


  }




}

