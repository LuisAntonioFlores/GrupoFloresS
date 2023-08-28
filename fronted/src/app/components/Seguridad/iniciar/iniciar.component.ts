import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroComponent } from '../registro/registro.component';
@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.component.html',
  styleUrls: ['./iniciar.component.css']
})
export class IniciarComponent {
  showPassword = false;
  iniciarForm: FormGroup;
  mensajeBienvenida: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal
  ) {
    this.iniciarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]], // Agregamos Validators.maxLength
      password: ['', [Validators.required, Validators.minLength(8)]] // Agregamos Validators.minLength
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  checInicio() {
    const email = this.iniciarForm.get('email')?.value;
    const password = this.iniciarForm.get('password')?.value;
  
    console.log('Email:', email);
    console.log('Password:', password);
  
    this.authService.checkInicioPass(email, password).subscribe(
      (res) => {
        console.log('Response:', res);
  
        if (!res.exists) {
          this.iniciarSesion();
        } else {
          console.log('El usuario y la contraseña son incorrectas');
        }
      },
      (err) => {
        console.error(err);
        console.log('Error al verificar el inicio de sesión en la base de datos.');
      }
    );
  }
  
  iniciarSesion() {
    const email = this.iniciarForm.get('email')?.value;
    const password = this.iniciarForm.get('password')?.value;

    const user = { email, password };
    this.authService.Iniciar(user).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/private']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // modal
  openRegistroModal() {
    const modalRef = this.modalService.open(RegistroComponent, { centered: true,size: 'lg' });
    modalRef.componentInstance.registroCompletado.subscribe(() => {
      modalRef.dismiss(); // Cerrar el modal
      this.mensajeBienvenida = '¡Bienvenido! Tu registro se ha completado.'; // Mostrar mensaje de bienvenida
    });
  
  }
}
