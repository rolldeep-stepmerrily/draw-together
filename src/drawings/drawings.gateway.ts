import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { DrawingsService } from './drawings.service';
import { IDrawing } from './drawings.interface';

@WebSocketGateway({ cors: { origin: '*' } })
export class DrawingsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly drawingsService: DrawingsService) {}

  handleConnection(client: Socket) {
    const currentDrawings = this.drawingsService.findCurrentDrawings();
    client.emit('init', currentDrawings);
  }

  @SubscribeMessage('draw')
  handleDraw(@MessageBody() data: IDrawing) {
    this.server.emit('draw', data);
    this.drawingsService.saveDrawing(data);
  }

  @SubscribeMessage('clear')
  handleClear() {
    this.server.emit('clear');
    this.drawingsService.clearDrawings();
  }
}
