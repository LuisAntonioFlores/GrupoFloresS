import { Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bienvenidos',
  templateUrl: './bienvenidos.component.html',
  styleUrls: ['./bienvenidos.component.scss']
})
export class BienvenidosComponent {
   // Añadir propiedades para almacenar datos del usuario
 nombre: string = '';
 apellidoPaterno: string = '';
 apellidoMaterno: string = '';
 tipoUsuario: string = '';
 sexo: string = '';
 menuState: string = 'out';
 @ViewChild('almacenMenu') almacenMenu!: MatMenu;
 title: string = 'fronted';
 loggedIn: boolean = false;
 @ViewChild('sidena') sidenav!: MatSidenav;
 
 constructor(public authService: AuthService, private route: ActivatedRoute) {}
 ngOnInit(): void {
   // Obtener datos del usuario al inicializar el componente
   this.authService.userData$.subscribe((userData) => {
     this.nombre = userData.nombre || '';
     this.apellidoPaterno = userData.apellidoPaterno || '';
     this.apellidoMaterno = userData.apellidoMaterno || '';
     this.tipoUsuario = userData.tipoUsuario || '';
     this.sexo = userData.sexo || '';

     console.log('Sexo recibido:', this.sexo);
   });
 }
 toggleSidenav() {
   this.sidenav.toggle();
 }
 toggleMenu() {
   this.menuState = this.menuState === 'out' ? 'in' : 'out';
 }
 isIniciarRoute(): boolean {
   return this.route.snapshot.firstChild?.routeConfig?.path === 'iniciar';
 }
 isRegistrarseRoute(): boolean {
   return this.route.snapshot.firstChild?.routeConfig?.path === 'registrar';
 }
 isPrivateRoute(): boolean {
   return (
     this.route.snapshot.firstChild?.routeConfig?.path === 'private' ||
     this.route.snapshot.firstChild?.routeConfig?.path === 'almacen'
   );

}
getSaludo(): string {
  if (this.sexo === 'Femenino') {
    return 'BIENVENIDA';
  } else if (this.sexo === 'Masculino') {
    return 'BIENVENIDO';
  } else {
    return 'BIENVENIDX'; // Para una opción neutra o inclusiva
  }
}
}
