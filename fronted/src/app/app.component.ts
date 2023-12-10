import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 constructor(public authService:AuthService){}
 title: string = 'fronted'; // Agregar la propiedad 'title' con el valor 'fronted'


}
