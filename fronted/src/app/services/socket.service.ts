import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { CarritoServiceService } from '../components/Tienda/carrito-service.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  private eventSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);



  constructor(private authService: AuthService, private carritoService: CarritoServiceService) {
    this.connect();
  }

  // Conectar con el servidor de Socket.IO
  private connect(): void {

    const clientId = this.authService.getId();// este viene desde mi auth.service desde el local storage y funciona 
    console.log('clientId desde localStorage: ', clientId);  // Verifica que no esté vacío
    if (!clientId) {
      console.error('clientId no está disponible, no se puede conectar al socket');
      return;
    }


    this.socket = io('http://localhost:3003', {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {

      console.log(`Cliente conectado con clientId: ${clientId}`);

      this.joinRoom(clientId);

      // Suscribirse al evento 'clearCart' una vez conectado
      this.listenToClearCartEvent();
    });
  }

  // Unir al cliente a una "room" usando su clientId
  joinRoom(clientId: string): void {
    this.socket?.emit('joinRoom', clientId);
    console.log(`Unido a la room con clientId: ${clientId}`);
  }

  leaveRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('leaveRoom', roomId);
    } else {
      console.warn('Socket no está conectado. No se puede salir de la room.');
    }
  }

  // Obtener el clientId del localStorage o retornar un valor por defecto
  private getClientId(): string {
    return localStorage.getItem('clientId') || '';
  }

  // Escuchar y manejar el evento 'clearCart' para limpiar el carrito antes de desconectar
  private listenToClearCartEvent(): void {
    // Log para verificar si el evento 'clearCart' está siendo escuchado
    console.log('Escuchando el evento "clearCart"...');

    this.listenToEvent('clearCart').subscribe(async (data) => {
        // Log para verificar los datos recibidos del evento
        console.log('Datos recibidos del evento "clearCart":', data);

        if (data) {
            console.log('Evento clearCart recibido, limpiando el carrito...');
            try {
                // Lógica para limpiar el carrito
                await this.carritoService.limpiarCarrito(); // Descomentar cuando se implemente la lógica real

                // Enviar confirmación de que el cliente recibió y procesó el evento
                this.emitEvent('confirmationFromClient', {
                    cliente_id: this.authService.getId(),
                    confirmation: 'received'
                });
                
                console.log('Carrito limpiado exitosamente. Procediendo a desconectar el socket.');

                // Emitir evento 'cartCleared' para confirmar la acción al backend
                this.emitEvent('cartCleared', { clientId: this.getClientId(), success: true });

                // Desconectar después de limpiar el carrito
                this.disconnect();
            } catch (error) {
                console.error('Error al limpiar el carrito:', error);
                this.emitEvent('cartCleared', { clientId: this.getClientId(), success: false, error: error });
            }
        } else {
            console.warn('No se recibieron datos para "clearCart" o los datos están vacíos.');
        }
    });
}


  // Método para limpiar el carrito y retornar una promesa que se resuelve al completarse

  // Escuchar eventos como Observable
  listenToEvent(eventName: string) {
    this.socket?.on(eventName, (data: any) => {
      this.eventSubject.next(data);
    });
    return this.eventSubject.asObservable();
  }

  // Método para emitir eventos
  emitEvent(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
  }
 
  // Desconectar del servidor de Socket.IO
  private disconnect(): void {
    this.socket?.disconnect();
  }
}
