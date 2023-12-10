import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import {  EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  showOtroInput: boolean = false;
  otroSexoDescripcion: string = '';
  @Output() registroCompletado = new EventEmitter<void>();

  user = { nombre: '', apellidoP: '', apellidoM: '', email: '', password: '', fechaNacimiento: '', sexo: '', tipoUsuario: 'Cliente' };
  passwordError: string = '';
  passwordVisible = false;
  ageError: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
    
  ) {}

  getMaxDate(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return currentDate;
}
validateAge() {
  const minAge = 18;
  const birthDate = new Date(this.user.fechaNacimiento);
  const currentDate = new Date();
  const ageDiff = currentDate.getFullYear() - birthDate.getFullYear();

  if (ageDiff < minAge) {
      this.ageError = 'Debes tener al menos 18 años.';
  } else {
      this.ageError = null;
  }
}
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  validarPassword(): string | null {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
  
    if (!passwordRegex.test(this.user.password)) {
      return 'La contraseña debe contener al menos una letra mayúscula, un número, un símbolo y tener una longitud mínima de 8 caracteres.';
    } else {
      return null;
    }
  }
  
  validarEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async registrar() {
    
   
    if (!this.user.nombre || !this.user.apellidoP || !this.user.apellidoM || !this.user.email || !this.user.password || !this.user.fechaNacimiento || !this.user.sexo || !this.user.tipoUsuario) {
      this.openErrorModal('Por favor, ingresa todos los datos requeridos.');
      return;
    }

    if (!this.validarEmail(this.user.email)) {
      this.openErrorModal('Por favor, ingresa una dirección de correo electrónico válida.');
      return;
    }
    // this.validarPassword(); // Validar la contraseña
    const passwordError = this.validarPassword();
    if (passwordError) {
      this.openErrorModal(passwordError);
      return;
    }
   
    if (!this.ageError) {
      // Lógica para registrar al usuario
      this.checEmail();
      // Emitir evento de registro completado
    this.registroCompletado.emit();
  }

    if (this.user.sexo === 'Otro' && this.otroSexoDescripcion) {
        this.user.sexo = this.otroSexoDescripcion;
    }
    
  }

  checEmail() {
    this.authService.checkEmailExists(this.user.email).subscribe(
      (res) => {
        if (res.exists) {
          this.openErrorModal('El correo electrónico ya está registrado en la base de datos.');
        } else {
          this.registerUser();
        }
      },
      (err) => {
        console.error(err);
        this.openErrorModal('Error al verificar el correo electrónico en la base de datos.');
      }
    );
  }

  registerUser() {
    this.authService.registrar(this.user)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/private']);
        },
        err => {
          console.error(err);
        }
      );
  }
  toggleOtroInput() {
    this.showOtroInput = !this.showOtroInput;
    if (!this.showOtroInput) {
        this.otroSexoDescripcion = '';
    }
    this.cdr.detectChanges(); // Forzar detección de cambios
}
  
   private openErrorModal(message: string) {
    const modalRef = this.modalService.open(ErrorModalComponent, { centered: true });
    modalRef.componentInstance.message = message;
  }
}
