import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'; // Asegúrate de importar el archivo de entorno

@Component({
  selector: 'app-user-perfil',
  templateUrl: './user-perfil.component.html',
  styleUrls: ['./user-perfil.component.scss']
})
export class UserPerfilComponent implements OnInit {
  isReadOnly: boolean = true;
  userForm!: FormGroup;
  imagePreview: string | null = null;
  defaultImage: string = 'assets/imagenes/fondo.jpeg';
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      personalInfo: this.fb.group({
        nombre: ['', [Validators.required]],
        apellidoPaterno: ['', [Validators.required]],
        apellidoMaterno: ['', [Validators.required]],
        sexo: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
      })
    });

    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    const nombre = this.authService.getNombre();
    const apellidoPaterno = this.authService.getApellidoPaterno();
    const apellidoMaterno = this.authService.getApellidoMaterno();
    const sexo = this.authService.getSexo();
    const fechaNacimiento = this.authService.getFechaNacimiento();
    const imagenPerfil = this.getImageUrl(this.authService.getImagen()|| undefined); // Usar getImageUrl para obtener la URL completa

    const formattedDate = fechaNacimiento ? new Date(fechaNacimiento).toISOString().split('T')[0] : '';

    this.userForm.patchValue({
      personalInfo: {
        nombre: nombre || '',
        apellidoPaterno: apellidoPaterno || '',
        apellidoMaterno: apellidoMaterno || '',
        sexo: sexo || '',
        fechaNacimiento: formattedDate,
      }
    });

    // Establecer la vista previa de la imagen si hay una imagen de perfil
    this.imagePreview = imagenPerfil || this.defaultImage;
  }

  getImageUrl(imagePath: string | undefined): string {
    const baseUrl = `${environment.baseUrl}:${environment.port}/`; // URL base desde el entorno
    return `${baseUrl}${imagePath?.startsWith('/') ? imagePath.slice(1) : imagePath || ''}`;
  }

  onImageSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];
      this.selectedImageFile = file;
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    if (!this.isReadOnly) {
      const fileInput = document.getElementById('image') as HTMLInputElement;
      fileInput.click();
    }
  }

  onSubmit(): void {
    if (this.isReadOnly) {
      this.toggleEdit();
    } else {
      if (this.userForm.invalid) {
        console.error('Formulario inválido');
        return;
      }

      const formValues = this.userForm.value.personalInfo;

      const userData = new FormData();
      userData.append('nombre', formValues.nombre);
      userData.append('apellidoPaterno', formValues.apellidoPaterno);
      userData.append('apellidoMaterno', formValues.apellidoMaterno);
      userData.append('sexo', formValues.sexo);
      userData.append('fechaNacimiento', formValues.fechaNacimiento);

      if (this.selectedImageFile) {
        userData.append('imagen', this.selectedImageFile);
      }

      this.authService.actualizarPerfil(userData).subscribe(
        (response) => {
          console.log('Perfil actualizado correctamente:', response);
          this.isReadOnly = true;
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error);
        }
      );
    }
  }

  toggleEdit(): void {
    this.isReadOnly = !this.isReadOnly;
  }
}
