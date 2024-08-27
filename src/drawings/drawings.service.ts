import { Injectable } from '@nestjs/common';
import { BehaviorSubject, scan, Subject } from 'rxjs';

import { IDrawing } from './drawings.interface';

@Injectable()
export class DrawingsService {
  private drawings: IDrawing[] = [];

  private drawSubject = new Subject<IDrawing>();

  private clearSubject = new Subject<void>();

  private drawingsBS = new BehaviorSubject<IDrawing[]>([]);

  constructor() {
    this.drawSubject.pipe(scan((acc: IDrawing[], cur: IDrawing) => [...acc, cur], [])).subscribe(this.drawingsBS);

    this.clearSubject.subscribe(() => this.drawingsBS.next([]));
  }

  saveDrawing(data: IDrawing) {
    this.drawings.push(data);
    this.drawSubject.next(data);
  }

  clearDrawings() {
    this.drawings = [];
    this.drawingsBS.next(this.drawings);
  }

  findDrawings() {
    return this.drawingsBS.asObservable();
  }

  findCurrentDrawings(): IDrawing[] {
    return this.drawings;
  }
}
