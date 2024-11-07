import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InformesContactoService } from 'src/app/services/informes-contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  telefono: string = '';
  quejas: string = ''; // Para el cuadro de texto opcional de quejas
  showModal: boolean = false; // Controla la visibilidad del modal

  constructor(private contactoService: InformesContactoService) {}

  // Este método se ejecutará al enviar el formulario
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return; // Si el formulario es inválido, no enviar
    }

    const formData = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      telefono: this.telefono,
      quejas: this.quejas
    };

    // console.log('Formulario enviado con los siguientes datos:', formData);

    this.contactoService.enviarDatosContacto(formData).subscribe(
      response => {
        // console.log('Datos enviados correctamente:', response);
        this.showModal = true;  // Mostrar el modal
      },
      error => {
        console.error('Error al enviar los datos:', error);
      }
    );
  }

  // Cerrar el modal
  closeModal() {
    this.showModal = false;
  }

  // Función para recargar la página
  recargarPagina() {
    window.location.reload(); // Recarga la página
  }
}
