import { Component, Input  } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent {

  // Referencia a la barra lateral
  @Input() sidenav: MatSidenav | undefined;
  constructor(private router: Router) {}


  // Función para manejar el clic en los enlaces del menú
  handleLinkClick(route: string): void {
    if (this.sidenav) {
      this.sidenav.open();
    }

    // Navega a la ruta deseada
    this.router.navigate([route]);
  }
}
