import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

declare const google: any; // Declarar el objeto global 'google'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const mapOptions = {
      center: { lat: 19.76871639198272, lng: -99.201950963222 }, // Coordenadas deseadas
      zoom: 18
    };

    const map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: { lat: 19.76871639198272, lng: -99.201950963222 },
      map: map,
      title: 'Ubicación'
    });

    // Agregar un evento de clic al marcador
    marker.addListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const origin = `${position.coords.latitude},${position.coords.longitude}`;
            const destination = '19.76871639198272,-99.201950963222'; // Coordenadas del destino

            const mapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
            window.open(mapsUrl, '_blank'); // Abrir en una nueva ventana o pestaña
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation not supported.');
      }
    });
  }
}
