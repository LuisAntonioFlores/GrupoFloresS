import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenu } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('out', style({
        opacity: 0,
        display: 'none'
      })),
      state('in', style({
        opacity: 1,
        display: 'block'
      })),
      transition('out => in', animate('150ms ease-in')),
      transition('in => out', animate('150ms ease-out'))
    ])
  ]
})
export class DropdownMenuComponent implements OnInit {
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  tipoUsuario: string = '';
  menuState: string = 'out';
  @ViewChild('almacenMenu') almacenMenu!: MatMenu;
  title: string = 'fronted';
  loggedIn: boolean = false;
  @ViewChild('sidena') sidenav!: MatSidenav;

  constructor(public authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const storedToken = this.authService.getToken();

    if (storedToken) {
      // Ya hay un token almacenado, suscribirse a userData$
      this.authService.userData$.subscribe((userData) => {
        // Actualizar propiedades del componente con los datos del usuario
        this.nombre = userData.nombre || '';
        this.apellidoPaterno = userData.apellidoPaterno || '';
        this.apellidoMaterno = userData.apellidoMaterno || '';
        this.tipoUsuario = userData.tipoUsuario || '';
      });
    }
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
  isAdministrador(): boolean {
    return this.tipoUsuario === 'Administrador'; // Ajusta según la representación real de un administrador en tu aplicación
  }
  isCliente(): boolean {
    return this.tipoUsuario === 'Cliente'; // Ajusta según la representación real de un cliente en tu aplicación
  }
}
