import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css']
})
export class DropdownMenuComponent {

  
  constructor(public authService:AuthService,private router: Router,private route: ActivatedRoute){}
 title: string = 'fronted'; // Agregar la propiedad 'title' con el valor 'fronted'
 
 getUsername(): string {
  const token = this.authService.getToken();

  if (token !== null) {
    const decodedToken: any = jwt_decode(token);
    
    if (decodedToken) {
      return decodedToken.username; // Ajusta esto según la estructura de tu token
    } else {
      return 'Nombre de usuario no encontrado';
    }
  } else {
    return 'No se ha iniciado sesión'; // Maneja el caso en el que no haya un token
  }
}
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
