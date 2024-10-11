import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenu } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

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
export class DropdownMenuComponent implements OnInit, OnDestroy {
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  tipoUsuario: string = '';
  menuState: string = 'out';
  userImage: string = '';
  @ViewChild('almacenMenu') almacenMenu!: MatMenu;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title: string = 'fronted';
  loggedIn: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(public authService: AuthService, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
      const storedToken = this.authService.getToken();
    
      if (storedToken) {
        this.loggedIn = true;
        this.authService.userData$.pipe(takeUntil(this.destroy$)).subscribe((userData) => {
          if (userData) {
            console.log('userData:', userData);
            this.nombre = userData.nombre || '';
            this.apellidoPaterno = userData.apellidoPaterno || '';
            this.apellidoMaterno = userData.apellidoMaterno || '';
            this.tipoUsuario = userData.tipoUsuario || '';
            this.loggedIn = true;
            this.cdr.detectChanges(); // Forzar la detección de cambios
            
          } else {
            console.error('No user data found');
          }
        });
      } else {
        this.loggedIn = false;
        this.cdr.detectChanges(); // Forzar la detección de cambios
      }
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    return this.tipoUsuario === 'Administrador';
  }

  isCliente(): boolean {
    return this.tipoUsuario === 'Cliente';
  }
}
