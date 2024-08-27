import { Injectable } from '@nestjs/common';

import { IDrawing } from './drawings.interface';

@Injectable()
export class DrawingsService {
  private drawingData: IDrawing[] = [];

  saveDrawing(data: IDrawing) {
    this.drawingData.push(data);
  }

  clearDrawings() {
    this.drawingData = [];
  }

  findDrawings() {
    return this.drawingData;
  }
}
