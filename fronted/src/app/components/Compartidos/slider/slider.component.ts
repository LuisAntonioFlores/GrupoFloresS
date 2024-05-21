import { Component, ElementRef, HostBinding, HostListener, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  intervalo!: any;
  arrowActual: string;
  radioButtonId!: string;
  translateX!: number;
  imgActual!: number;
  imgDesplazar!: number;
  cuenta!: number;
  ciclo!: number;
  estado: boolean;
  botonRadioPulsado!: number;
  totImg: number;
  timeOut!: any;
  interval!: any;
  timeImageSlide: number;
  timeImageClick: number;
  arrUrlIMG: string[];
  inicioX!: number; // Se agrega la propiedad inicioX
  finX!: number; // Se agrega la propiedad finX
  idImgSelected!: string;

  @HostBinding("style.--paddLeft")
  @Input()
  paddLeft: string;
  @HostBinding("style.--paddRight")
  @Input()
  paddRight: string;

  @HostListener('mousedown', ['$event']) onMouseDown(e: any) {
    e.preventDefault();
    this.inicioX = e.offsetX;
  }
  @HostListener('mouseup', ['$event']) onMouseUp(e: any) {
    this.limpiarIntervalos();
    this.finX = e.offsetX;
    const resultado = this.inicioX - this.finX;
    if (resultado > 0) {
      this.next(1);
    } else if (resultado < 0) {
      this.prev(1);
    }
    this.timeOutCiclo(this.timeImageClick, this.timeImageSlide);
  }

  @ViewChild("imgDiv") imgDiv!: ElementRef;

  constructor(private renderer: Renderer2) {
    this.totImg = 0;
    this.estado = true;
    this.arrowActual = "";
    this.arrUrlIMG = [];
    this.paddLeft = '180px';
    this.paddRight = '180px';
    this.timeImageSlide = 5000;
    this.timeImageClick = 5000;
  }

  ngOnInit(): void {
    this.arrUrlIMG = ["prueba_slide1.jpg", "prueba_slide2.jpg", "prueba_slide3.jpg", "prueba_slide4.jpg",
                     "1.jpg", "2.jpg", "3.jpg","Bloc hueco.jpg",
                    "cocol.jpg","Ligero.jpg","Pesado.jpg","Rustico.jpg"
    ];
    this.radioButtonId = this.arrUrlIMG[this.arrUrlIMG.length - 1];
    this.arrUrlIMG.splice(0, 0, this.arrUrlIMG[this.arrUrlIMG.length - 1]);
    this.arrUrlIMG.pop();
  }

  ngAfterViewInit(): void {
    this.totImg = this.arrUrlIMG.length;
    for (let i = 0; i < this.totImg; i++) {
      const imgNew = this.renderer.createElement('img');
      this.renderer.setAttribute(imgNew, 'id', i.toString());
      this.renderer.setAttribute(imgNew, 'class', `img${i.toString()}`);
      this.renderer.setAttribute(imgNew, 'src', `./assets/images/${this.arrUrlIMG[i]}`);
      this.renderer.appendChild(this.imgDiv.nativeElement, imgNew);
    }
    this.renderer.setStyle(this.imgDiv.nativeElement, 'transition', 'transform 1s');
    this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', 'translateX(-100%)');
    this.loopInfinite();
  }

  selectedCard(e: any) {
    this.idImgSelected = e.target.id;
  }

  loopInfinite() {
    this.radioButtonId = this.arrUrlIMG[0];
    this.imgActual = 0;
    this.cuenta = 0;
    this.ciclo = 0;
    this.translateX = 0;
  
    this.intervalo = setInterval(() => {
      this.cuenta += 1;
      this.imgActual += 1;
  
      if (this.imgActual >= this.totImg) {
        this.imgActual = 0;
        this.ciclo += 1;
      }
  
      let desplazamiento = this.ciclo * 100; // Calculamos el desplazamiento para el ciclo actual
      let desplAll = desplazamiento + (this.cuenta * 100); // Calculamos el desplazamiento total
  
      // Ajustamos el desplazamiento si estamos mostrando parcialmente la última imagen
      if (this.imgActual === 0 && this.translateX !== 0) {
        const overflow = Math.abs(this.translateX) % 100;
        desplazamiento -= 100 - overflow;
        desplAll -= 100 - overflow;
      }
  
      // Si hemos mostrado completamente la última imagen, volvemos al inicio
      if (this.imgActual === 0 && this.translateX === 0) {
        this.renderer.setStyle(this.imgDiv.nativeElement, 'transition', 'none');
        setTimeout(() => {
          this.renderer.setStyle(this.imgDiv.nativeElement, 'transition', 'transform 1s');
          this.cuenta = 0;
          this.ciclo = 0;
          this.translateX = 0;
        }, 50); // Pequeña pausa para evitar que la transición se active abruptamente
      }
  
      this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(-${desplAll}%)`);
      this.radioButtonId = this.arrUrlIMG[this.imgActual];
    }, this.timeImageSlide);
  }
  
  
  
  
  
  timeOutCiclo(timeOut: any, timeInterval: any) {
    this.timeOut = setTimeout(() => {
      this.interval = setInterval(() => {
        this.next(1);
      }, timeInterval);
    }, timeOut);
  }

  onClickRadioBoton(idRadio: number) {
    this.limpiarIntervalos();
    this.botonRadioPulsado = idRadio;
    // Calcula la nueva imagen actual basada en el intervalo seleccionado
    this.imgActual = idRadio;
    // Calcula el nuevo desplazamiento basado en la nueva imagen actual
    let desplazamiento = this.imgActual * -100;
    // Aplica el nuevo desplazamiento al contenedor de imágenes
    this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(${desplazamiento}%)`);
    // Reinicia el ciclo con el nuevo intervalo seleccionado
    this.timeOutCiclo(this.timeImageClick, this.timeImageSlide);
  }
  
  limpiarIntervalos() {
    clearInterval(this.intervalo);
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
  }

  onClickRow(arrowPulsada: string) {
    this.limpiarIntervalos();
    if (arrowPulsada == 'next') {
      this.next(1);
    } else if (arrowPulsada == 'prev') {
      this.prev(1);
    }
    this.timeOutCiclo(this.timeImageClick, this.timeImageSlide);
  }

  next(loop: number) {
    for (let i = 0; i < loop; i++) {
      if (this.imgActual == 0) {
        this.ciclo += 1;
        this.translateX = this.ciclo * -100 * this.totImg;
      }
      this.imgActual = (this.imgActual + 1) % this.totImg;
      this.cuenta++;
      let desplAll = this.cuenta * -100;
      this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(${desplAll}%)`);
      const img = (this.imgDiv.nativeElement as HTMLElement).childNodes.item(this.imgDesplazar);
      this.renderer.setStyle(img, 'transform', `translateX(${this.translateX}%)`);
    }
  }

  prev(loop: number) {
    for (let i = 0; i < loop; i++) {
      const img = (this.imgDiv.nativeElement as HTMLElement).childNodes.item(this.imgDesplazar);
      this.renderer.setStyle(img, 'transform', `translateX(${this.translateX + (100 * this.totImg)}%)`);
      this.cuenta--;
      let desplAll = this.cuenta * -100;
      this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(${desplAll}%)`);
      this.imgActual = (this.imgActual - 1 + this.totImg) % this.totImg;
    }
  }


  ngOnDestroy(): void {
    this.limpiarIntervalos();
  }
}
