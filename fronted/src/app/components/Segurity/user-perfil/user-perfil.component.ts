import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-perfil',
  templateUrl: './user-perfil.component.html',
  styleUrls: ['./user-perfil.component.scss']
})
export class UserPerfilComponent implements OnInit {

  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    // Inicializar el formulario
    this.userForm = this.fb.group({
      personalInfo: this.fb.group({
        nombre: ['', [Validators.required]],
        apellidoPaterno: ['', [Validators.required]],
        apellidoMaterno: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      })
    });

    // Cargar los datos del usuario
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    const nombre = this.authService.getNombre();
    const apellidoPaterno = this.authService.getApellidoPaterno();
    const apellidoMaterno = this.authService.getApellidoMaterno();
    const telefono = '1234567890'; // Reemplaza con el valor que desees obtener o configurar

    this.userForm.patchValue({
      personalInfo: {
        nombre: nombre || '',
        apellidoPaterno: apellidoPaterno || '',
        apellidoMaterno: apellidoMaterno || '',
        telefono: telefono
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Formulario enviado:', this.userForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

}
