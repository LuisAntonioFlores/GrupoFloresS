import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css']
})
export class DropdownMenuComponent {
  constructor(public authService:AuthService,private router: Router,private route: ActivatedRoute){}
 title: string = 'fronted'; // Agregar la propiedad 'title' con el valor 'fronted'
 
 isIniciarRoute(): boolean {
  return this.route.snapshot.firstChild?.routeConfig?.path === 'iniciar';
}
isRegistrarseRoute(): boolean {
  return this.route.snapshot.firstChild?.routeConfig?.path === 'registrar';
}
isPrivateRoute(): boolean {
  return this.route.snapshot.firstChild?.routeConfig?.path === 'private';
}
}