import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenu } from '@angular/material/menu';
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
  // Añadir propiedades para almacenar datos del usuario
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
    // Obtener datos del usuario al inicializar el componente
    this.authService.userData$.subscribe((userData) => {
      this.nombre = userData.nombre || '';
      this.apellidoPaterno = userData.apellidoPaterno || '';
      this.apellidoMaterno = userData.apellidoMaterno || '';
      this.tipoUsuario = userData.tipoUsuario || '';
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
}
