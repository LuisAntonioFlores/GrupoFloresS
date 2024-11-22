import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationServiceService } from 'src/app/services/verification-service.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent {
  emailUsuario: string | null = null; // Correo obtenido del AuthService
  code: string = ''; // Código de verificación ingresado
  isCodeSent: boolean = false; // Estado del envío del código
  message: string = ''; // Mensajes de feedback para el usuario

  constructor(
    private verificationService: VerificationServiceService,
   private authService: AuthService,
   private router: Router
  ) {}

  ngOnInit(): void {
    
    // Obtener el email del usuario desde AuthService
    this.emailUsuario = this.authService.getEmail();
    console.log('Correo del usuario:', this.emailUsuario); 
    
  }

  // Método público para acceder al correo
  getEmail() {
    return this.authService.getEmail();
  }

  sendCode() {
    if (!this.emailUsuario) {
      this.message = 'No se pudo obtener el correo electrónico del usuario.';
      return;
    }

    this.verificationService.sendVerificationCode(this.emailUsuario).subscribe(
      (response) => {
        this.isCodeSent = true;
        this.message = 'Código enviado al correo electrónico proporcionado.';
      },
      (error) => {
        this.message = 'Error al enviar el código. Por favor, intenta nuevamente.';
        console.error(error);
      }
    );
  }

  verifyCode() {
    if (!this.code) {
      this.message = 'Por favor, ingresa el código de verificación.';
      return;
    }

    if (!this.emailUsuario) {
      this.message = 'No se pudo obtener el correo electrónico del usuario.';
      return;
    }

    this.verificationService.verifyCode(this.emailUsuario, this.code).subscribe(
      (response) => {
        this.message = '¡Código verificado exitosamente!';
        this.router.navigate(['/dashboard/Address/direccion_fom']);
      },
      (error) => {
        this.message = 'El código ingresado es incorrecto.';
        console.error(error);
      }
    );
  }
}
