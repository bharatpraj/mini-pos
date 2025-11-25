import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  /**
   * Emit an event to connected clients with the given payload.
   * @param event The event name to emit.
   * @param payload The data to send with the event.
   */
  emitOrder(event: string, payload: any) {
    this.logger.log(`Emitting ${event}`);
    this.server.emit(event, payload);
  }
}
