import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket!: Socket;

  connect(): void {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(environment.wsUrl, {
        transports: ['websocket'],
      });
    }
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  on<T>(event: string): Observable<T> {
    return new Observable(observer => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}

