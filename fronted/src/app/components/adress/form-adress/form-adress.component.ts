import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AdressService } from '../adress.service';
import { ApiResponse, ResponseItem } from 'src/app/interfaces/copomex';

@Component({
  selector: 'app-form-adress',
  templateUrl: './form-adress.component.html',
  styleUrls: ['./form-adress.component.scss']
})
export class FormAdressComponent implements OnInit {
  addressForm: FormGroup;
  colonias: string[] = [];
  settlements: ResponseItem[] = [];
  formStatus: 'success' | 'error' | null = null;
  
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private addresServices: AdressService
  ) {
    this.addressForm = this.fb.group({
      country: [{ value: 'México', disabled: true }],
      fullName: [{ value: '', disabled: true }, Validators.required],
      postalCode: ['', Validators.required],
      state: [{ value: '', disabled: true }, Validators.required],
      municipality: [{ value: '', disabled: true }, Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      interiorNumber: [''],
      crossStreet1: ['', Validators.required],
      crossStreet2: ['', Validators.required],
      addressType: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\+52\d{10}$/)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
    
  
    // Recuperar y concatenar nombre y apellidos del AuthService
    const userName = this.authService.getNombre();
    const lastNamePaternal = this.authService.getApellidoPaterno();
    const lastNameMaternal = this.authService.getApellidoMaterno();

    if (userName && lastNamePaternal && lastNameMaternal) {
      const fullName = `${userName} ${lastNamePaternal} ${lastNameMaternal}`;
      
      // Asignar el nombre completo al campo fullName, deshabilitado
      this.addressForm.patchValue({
        fullName: fullName
      });
    }

    // Escuchar cambios en el campo de Código Postal
    this.addressForm.get('postalCode')?.valueChanges.subscribe(() => {
      this.onCodigoPostalChange();
    });
  }

  onCodigoPostalChange(): void {
    const codigoPostal = this.addressForm.get('postalCode')?.value;
  
    if (codigoPostal && codigoPostal.length === 5) {
      this.addresServices.obtenerDatosPorCodigoPostal(codigoPostal).subscribe(
        (data: ApiResponse[]) => {
          console.log('Datos obtenidos de la API:', data); // Muestra todos los datos
  
          // Itera sobre cada item en el array y muestra la información relevante
          data.forEach(item => {
            console.log('Asentamiento:', item.response.asentamiento);
            console.log('Municipio:', item.response.municipio);
            console.log('Estado:', item.response.estado);
          });
  
          // Procesa los asentamientos para el formulario
          if (data.length > 0) {
            this.colonias = data.map(item => item.response.asentamiento);
            
            // Asigna el estado y municipio del primer elemento
            const firstResponse = data[0].response;
            this.addressForm.patchValue({
              state: firstResponse.estado,
              municipality: firstResponse.municipio,
              locality: firstResponse.asentamiento, // Asignar la localidad
            });
          }
        },
        (error) => {
          console.error('Error al obtener datos del código postal:', error);
        }
      );
    }
  }

  // Método de envío del formulario
  onSubmit(): void {
    if (this.addressForm.valid) {
      // Obtén el userId desde AuthService
      const userId = this.authService.getId(); // Cambiado a getId()
  
      // Prepara los datos para enviar, incluyendo el userId
      const formData = {
        cliente_id: userId, // Cambiado a cliente_id
        nombreUsuario: this.addressForm.get('fullName')?.value, // Cambiado a nombreUsuario
        codigoPostal: this.addressForm.get('postalCode')?.value, // Cambiado a codigoPostal
        estado: this.addressForm.get('state')?.value, // Cambiado a estado
        municipio: this.addressForm.get('municipality')?.value, // Cambiado a municipio
        colonia: this.addressForm.get('locality')?.value, // Cambiado a colonia
        calle: this.addressForm.get('street')?.value, // Cambiado a calle
        numero: this.addressForm.get('number')?.value, // Cambiado a numero
        numeroInterior: this.addressForm.get('interiorNumber')?.value, // Cambiado a numeroInterior
        tipo: this.addressForm.get('addressType')?.value, // Cambiado a tipo
        numeroContacto: this.addressForm.get('contactNumber')?.value, // Cambiado a numeroContacto
        descripcion: this.addressForm.get('description')?.value, // Cambiado a descripcion
       // country: 'México' // Esto no está en el servidor, puedes omitirlo
      };
      
      console.log('Datos a enviar:', formData);
  
      // Enviar los datos al servidor
      this.addresServices.guardarDireccion(formData).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          this.formStatus = 'success';
          this.addressForm.reset(); // Opcional: resetear el formulario
        },
        (error) => {
          console.error('Error al guardar la dirección:', error);
          this.formStatus = 'error';
        }
      );
    } else {
      this.formStatus = 'error';
    }
  
    // Restablecer el estado del formulario después de un tiempo
    setTimeout(() => {
      this.formStatus = null;
    }, 2500);
  }
}
