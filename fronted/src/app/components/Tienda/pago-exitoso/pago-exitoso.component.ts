// pago-exitoso.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
  styleUrls: ['./pago-exitoso.component.scss']
})
export class PagoExitosoComponent implements OnInit {
  showSuccessMessage = true;
  clienteId: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.clienteId = this.authService.getId() || localStorage.getItem('clientId') || '';
    this.socketService.joinRoom(this.clienteId);
  }

  continueShopping(): void {
    // Añadimos la clase 'fadeOut' para la animación
    const successMessageDiv = document.querySelector('.pago-exitoso');
    if (successMessageDiv) {
      successMessageDiv.classList.add('fadeOut');
    }

    setTimeout(() => {
      this.router.navigate(['/dashboard/Shop/Tienda']); // Redirige después de la animación
    }, 1000); // Espera 1 segundo para completar la animación
  }
}
