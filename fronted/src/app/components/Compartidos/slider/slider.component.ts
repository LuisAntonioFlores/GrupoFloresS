import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnDestroy {
  imgActual: number = 0;
  arrUrlIMG: string[] = [
    "slide.jpg", "slide1.jpg", "slide2.jpg", "slide3.jpg", "slide4.jpg",
    "slide5.jpg", "slide6.jpg", "slide7.jpg", "slide8.jpg", "slide9.jpg", "slide10.jpg"
  ];
  interval!: any;

  ngOnInit(): void {
  //  console.log(this.arrUrlIMG);  // Verifica los nombres de las imágenes
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);  // Limpiar el intervalo al destruir el componente
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.next();  // Avanza a la siguiente imagen
    }, 5000);  // Cambia la imagen cada 5 segundos
  }

  next(): void {
    this.imgActual = (this.imgActual + 1) % this.arrUrlIMG.length;  // Cambia al siguiente índice
  }

  prev(): void {
    this.imgActual = (this.imgActual - 1 + this.arrUrlIMG.length) % this.arrUrlIMG.length;  // Cambia al índice anterior
  }

  onClickRadioBoton(index: number): void {
    this.imgActual = index;
    clearInterval(this.interval);  // Detener el auto-slide
    this.startAutoSlide();  // Reiniciar el auto-slide
  }
}
