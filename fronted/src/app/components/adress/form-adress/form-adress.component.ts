import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AdressService } from '../adress.service';
import { ApiResponse } from 'src/app/interfaces/copomex';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-adress',
  templateUrl: './form-adress.component.html',
  styleUrls: ['./form-adress.component.scss']
})
export class FormAdressComponent implements OnInit {
  addressForm: FormGroup;
  colonias: string[] = [];
  formStatus: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private addressService: AdressService,
    private router: Router
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
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
      this.addressForm.patchValue({ fullName });
    }

    // Recuperar la dirección desde localStorage y actualizar el formulario

    // this.addressForm.get('postalCode')?.valueChanges.subscribe(() => {
    //   this.onCodigoPostalChange();
    // });
  }

  onCodigoPostalChange(): void {
    const codigoPostal = this.addressForm.get('postalCode')?.value;
  
    if (codigoPostal && codigoPostal.length === 5) {
      this.addressService.obtenerDatosPorCodigoPostal(codigoPostal).subscribe(
        (data: ApiResponse[]) => {
          this.colonias = data.map(item => item.response.asentamiento);
  
          const firstResponse = data[0]?.response;
          if (firstResponse) {
            this.addressForm.patchValue({
              state: firstResponse.estado,
              municipality: firstResponse.municipio,
              locality: firstResponse.asentamiento,
            });
          }
        },
        (error) => {
          console.error('Error al obtener datos del código postal:', error);
        }
      );
    } else {
      console.warn('El código postal debe tener 5 dígitos.');
    }
  }
  

  onSubmit(): void {
    const userId = this.authService.getId() || '';
  // console.log('ID del usuario que está consultando:', userId);

    if (this.addressForm.valid) {
      const formData = this.prepareFormData();

      this.addressService.obtenerDireccionesPorUsuario(userId).subscribe(
        (response) => {
       //  console.log('Respuesta de direcciones obtenida:', response);

          // Comprobación basada en la estructura del objeto devuelto
          if (response.existe === false || response.direcciones.length === 0) {
            // No hay direcciones, guardar la nueva dirección y redirigir a bienvenida
            this.guardarDireccion(formData, true);
          } else {
            // Ya hay direcciones, guardar la nueva dirección y redirigir al dashboard
            this.guardarDireccion(formData, false);
          }
        },
        (error) => {
          console.error('Error al obtener las direcciones del usuario:', error);
          this.formStatus = 'error';
        }
      );
    } else {
      this.formStatus = 'error';
    }

    setTimeout(() => {
      this.formStatus = null;
    }, 2500);
  }




  guardarDireccion(formData: any, shouldRedirect: boolean): void {
    this.addressService.guardarDireccion(formData).subscribe(
      (response) => {
        // console.log('Dirección guardada:', response);
        if (shouldRedirect) {
          // Redirigir a la página de bienvenida
          this.router.navigate(['/bienvenido']);
        } else {
          // Redirigir al dashboard de direcciones
          this.router.navigate(['/dashboard/Address/direccion_lista']);
        }
      },
      (error) => {
        console.error('Error al guardar la dirección:', error);
        this.formStatus = 'error';
      }
    );
  }


  private prepareFormData() { // Asegurarse de que el número de contacto tiene el prefijo +52
    let contactNumber = this.addressForm.get('contactNumber')?.value;

    // Si el número no comienza con +52, se agrega
    if (contactNumber && !contactNumber.startsWith('+52')) {
      contactNumber = `+52${contactNumber}`;
    }
    return {
      cliente_id: this.authService.getId(),
      codigoPostal: this.addressForm.get('postalCode')?.value,
      estado: this.addressForm.get('state')?.value,
      municipio: this.addressForm.get('municipality')?.value,
      colonia: this.addressForm.get('locality')?.value,
      calle: this.addressForm.get('street')?.value,
      numero: this.addressForm.get('number')?.value,
      numeroInterior: this.addressForm.get('interiorNumber')?.value,
      tipo: this.addressForm.get('addressType')?.value,
      numeroContacto: contactNumber,
      descripcion: this.addressForm.get('description')?.value,
    };
  }
}
