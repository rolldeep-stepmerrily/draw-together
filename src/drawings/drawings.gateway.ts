import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { DrawingsService } from './drawings.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class DrawingsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly drawingsService: DrawingsService) {}

  @SubscribeMessage('draw')
  handleDraw(@MessageBody() data: any) {
    this.server.emit('draw', data);
    this.drawingsService.saveDrawing(data);
  }

  @SubscribeMessage('clear')
  handleClear() {
    this.server.emit('clear');
    this.drawingsService.clearDrawings();
  }
}
