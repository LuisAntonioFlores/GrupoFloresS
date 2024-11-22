import { Component } from '@angular/core';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private passwordService: PasswordService) {}

  onSubmit() {
    this.passwordService.recuperarContrasena(this.email).subscribe({
      next: (response) => {
        this.successMessage = 'Correo enviado con éxito. Revisa tu bandeja de entrada.';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Error al enviar el correo. Intenta nuevamente.';
        this.successMessage = '';
      },
    });
  }
}
