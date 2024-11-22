import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.scss']
})
export class CambiarContrasenaComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  token: string | null = null;
  passwordVisible: boolean = false; // Control para mostrar/ocultar contraseña
  confirmPasswordVisible: boolean = false;

  constructor(
    private passwordService: PasswordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el token desde la URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token no válido o ausente.';
    }
  }

  // Validar si la contraseña cumple con los requisitos
  isPasswordValid(): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(this.newPassword);
  }

  onSubmit(): void {
    // Validar contraseña
    if (!this.isPasswordValid()) {
      this.errorMessage =
        'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.';
      return;
    }

    // Verificar que las contraseñas coincidan
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.token) {
      this.passwordService.cambiarContrasena(this.token, this.newPassword).subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada correctamente.';
          this.errorMessage = '';
          // Redirigir a la página de inicio de sesión después de unos segundos
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar la contraseña.';
          console.error(error);
        }
      });
    }
  }

  // Alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
