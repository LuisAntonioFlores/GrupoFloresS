import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // Importa NgbActiveModal


@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  @Input() message!: string;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  public closeModal() {
    // Cierra el modal utilizando activeModal
    this.activeModal.dismiss();
}
}