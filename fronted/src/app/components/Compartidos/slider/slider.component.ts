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
  timeOut!: any
  interval!: any
  timeImageSlide: number;
  timeImageClick: number;
  arrUrlIMG: string[];
  // arrNavLink!: ElementRef[];
  idImgSelected!: number;
  inicioX!: number;
  finX!: number;
  //binding al css
  @HostBinding("style.--paddLeft")
  @Input()
  paddLeft: string;
  @HostBinding("style.--paddRight")
  @Input()
  paddRight: string;
  //Arrastrar con mouse o dedo para desplazar imágenes
  @HostListener('mousedown', ['$event']) onMouseDown(e: any) {
    e.preventDefault()
    this.inicioX = e.offsetX
  }
  @HostListener('mouseup', ['$event']) onMouseUp(e: any) {
    this.limpiarIntervalos();
    this.finX = e.offsetX
    const resultado = this.inicioX - this.finX
    if (resultado > 0) {
      this.next(1)
    } else if (resultado < 0) {
      this.prev(1)
    }
    //ciclo infinito
    this.timeOutCiclo(this.timeImageClick, this.timeImageSlide)
  }
  //DOM  
  @ViewChild("imgDiv") imgDiv!: ElementRef;
  constructor(private renderer: Renderer2) {
    this.totImg = 0
    this.estado = true;
    this.arrowActual = "";
    this.arrUrlIMG = []
    this.paddLeft = '180px';
    this.paddRight = '180px';
    //tiempos en milisegundos cambio de imagen en slider
    this.timeImageSlide = 5000
    //tiempo en milisegundos a esperar luego de dar click a flechas o  botones radio
    this.timeImageClick = 5000
  }
  ngOnInit(): void {
    
    this.arrUrlIMG = ["prueba_slide1.jpg", "prueba_slide2.jpg", 
                      "prueba_slide3.jpg", "prueba_slide4.jpg", 
                      ]
    this.radioButtonId = this.arrUrlIMG[this.arrUrlIMG.length - 1]
    //Ultima imagen del array al inicio del array
    this.arrUrlIMG.splice(0, 0, this.arrUrlIMG[this.arrUrlIMG.length - 1])
    this.arrUrlIMG.pop()
  }
  ngAfterViewInit(): void {
    //Creacion de elementos html img para imagenes
    this.totImg = this.arrUrlIMG.length
    for (let i = 0; i < this.totImg; i++) {
      // const id = i
      const imgNew = this.renderer.createElement('img');
      this.renderer.setAttribute(imgNew, 'id', i.toString())
      this.renderer.setAttribute(imgNew, 'class', `img${i.toString()}`)
      this.renderer.setAttribute(imgNew, 'src', `./assets/images/${this.arrUrlIMG[i]}`);
      this.renderer.appendChild(this.imgDiv.nativeElement, imgNew);
    }
    //desplazo contenedor de imagenes una posicion hacia la izquierda  para ocultar la imagen 0 que es la  ultima del array inicial.
    this.renderer.setStyle(this.imgDiv.nativeElement, 'transition', 'transform 1s')
    this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', 'translateX(-100%)')
    this.loopInfinite();
  }
  selectedCard(e: any) {
    //TODO  --enviar a página preview para ver el producto y sus  caracteristicas
    this.idImgSelected = e.target.id
  }
  loopInfinite() {
    this.radioButtonId = this.arrUrlIMG[0]
    this.imgActual = 0
    this.cuenta = 0
    this.ciclo = 0
    this.translateX = 0
    //loop
    this.intervalo = setInterval(() => {
      this.cuenta += 1
      //se aumenta en 1 el ciclo cada vez
      if (this.imgActual == 0) {
        this.ciclo += 1
        this.translateX = this.ciclo * 100 * this.totImg
      }
      //
      this.imgActual += 1
      if (this.imgActual > (this.totImg - 1)) {
        this.imgActual = 0
      }
      this.imgDesplazar = this.imgActual - 1
      if (this.imgActual == 0) {
        this.imgDesplazar = this.totImg - 1
      }
      //desplazar todo
      let desplAll = (this.cuenta + 1) * -100
      this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(${desplAll}%`)
      //Desplazar una a una las imagenes      
      const img = (this.imgDiv.nativeElement as HTMLElement).childNodes.item(this.imgDesplazar);
      this.renderer.setStyle(img, 'transform', `translateX(${this.translateX}%`)
      //radio buton activo
      this.radioButtonId = this.arrUrlIMG[this.imgActual]
    }, this.timeImageSlide)
  }
  //Ciclo infinito despues de dar click a 'botones flecha' o 'botones  radio'
  timeOutCiclo(timeOut: any, timeInterval: any) {
    this.timeOut = setTimeout(() => {
      this.interval = setInterval(() => {
        this.next(1)
      }, timeInterval)
    }, timeOut);
  }
  onClickRadioBoton(idRadio: number) {
    this.limpiarIntervalos();
    //Color a boton radio activo
    this.botonRadioPulsado = idRadio
    var btnActual = 0
    if (this.imgDesplazar == (this.totImg - 1)) {
      btnActual = 0
    } else {
      btnActual = this.imgDesplazar + 1
    }
    //resta
    const resta = btnActual - this.botonRadioPulsado;
    if (resta < 0) {
      this.next(Math.abs(resta))
    } else if (resta > 0) {
      this.prev(Math.abs(resta))
    };
    this.timeOutCiclo(this.timeImageClick, this.timeImageSlide)
  }
  //Limpiar todos los intervalos para detener la animación
  limpiarIntervalos() {
    clearInterval(this.intervalo)
    clearInterval(this.interval)
    clearTimeout(this.timeOut)
  }
  //Funcion al dar clic en flechas <>
  onClickRow(arrowPulsada: string) {
    this.limpiarIntervalos()
    //NEXT>
    if (arrowPulsada == 'next') {
      this.next(1)
      //<PREV
    } else if (arrowPulsada == 'prev') {
      this.prev(1)
    };
    this.timeOutCiclo(this.timeImageClick, this.timeImageSlide)
  }
  //Next loop
  next(loop: number) {
    for (let i = 0; i < loop; i++) {
      if (this.estado) {
        //Si llegamos a la ultima imagen del array, se aumenta en 1 el  ciclo cada vez
        if (this.imgActual == 0) {
          this.ciclo += 1
          this.translateX = this.ciclo * 100 * this.totImg;
        }
        //
        this.imgActual += 1
        if (this.imgActual > (this.totImg - 1)) { this.imgActual = 0 }
        this.imgDesplazar = this.imgActual - 1
        if (this.imgActual == 0) { this.imgDesplazar = this.totImg - 1 }
        //desplazar todo
        this.cuenta += 1
        let desplAll = (this.cuenta + 1) * -100
        this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(${desplAll}%`);
        //Desplazar una a una las imagenes      
        const img = (this.imgDiv.nativeElement as HTMLElement).childNodes.item(this.imgDesplazar);
        this.renderer.setStyle(img, 'transform', `translateX(${this. translateX}%`);
      } else {
        //si aun no se ha pulsado boton prev
        //Desplazar una a una las imagenes
        const img = (this.imgDiv.nativeElement as HTMLElement).childNodes.item(this.imgDesplazar);
        this.renderer.setStyle(img, 'transform', `translateX(${this. translateX}%`);
        //desplazar todo
        this.cuenta += 1
        let desplAll = (this.cuenta + 1) * -100
        this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(${desplAll}%`);
        this.imgDesplazar += 1
        if (this.imgDesplazar > (this.totImg - 1)) {
          this.imgDesplazar = 0
          this.ciclo += 1
          this.translateX = this.ciclo * 100 * this.totImg;
        }
      }
    }
    //Color a boton radio activo
    var btnActual = 0
    if (this.imgDesplazar == (this.totImg - 1)) {
      btnActual = 0
    } else {
      btnActual = this.imgDesplazar + 1
    }
    this.radioButtonId = this.arrUrlIMG[btnActual];
  }
  prev(loop: number) {
    for (let i = 0; i < loop; i++) {
      //Desplazar una a una las imagenes
      const img = (this.imgDiv.nativeElement as HTMLElement).childNodes.
 item(this.imgDesplazar);
      this.renderer.setStyle(img, 'transform', `translateX(${this.translateX - (100 * this.totImg)}%`);
      //desplazar todo
      this.cuenta -= 1
      let desplAll = (+this.cuenta + 1) * -100
      this.renderer.setStyle(this.imgDiv.nativeElement, 'transform', `translateX(${desplAll}%`);
      this.imgDesplazar -= 1
      if (this.imgDesplazar < 0) {
        this.imgDesplazar = this.totImg - 1
        this.ciclo -= 1
        this.translateX = this.ciclo * 100 * this.totImg;
      }
    }
    //Radio boton activo
    var btnActual = 0
    if (this.imgDesplazar == (this.totImg - 1)) {
      btnActual = 0
    } else {
      btnActual = this.imgDesplazar + 1
    }
    this.radioButtonId = this.arrUrlIMG[btnActual];
    this.estado = false
  }
  //al salir del home, elimino el loop intervalo********************
  ngOnDestroy(): void {
    this.limpiarIntervalos()
  }
  

}
