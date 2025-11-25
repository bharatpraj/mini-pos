import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private socket!: Socket;
  private connected = false;

  constructor() {
    this.init();
  }

  /** Initialize WebSocket connection */
  private init() {
    this.socket = io(environment.wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('[WS] Connected to server');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.warn('[WS] Disconnected, retrying...');
    });

    this.socket.on('connect_error', (err) => {
      console.error('[WS] Connection Error:', err.message);
    });
  }

  /** Manually connect if needed */
  connect(): void {
    if (!this.connected) {
      this.socket.connect();
    }
  }

  /** Disconnect */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * Listen for server events
   * Ensures cleanup when unsubscribed
   */
  on<T>(event: string): Observable<T> {
    return new Observable(observer => {
      const handler = (data: T) => observer.next(data);

      this.socket.on(event, handler);

      return () => {
        this.socket.off(event, handler); // cleanup
      };
    });
  }

  /** Emit events to server */
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
