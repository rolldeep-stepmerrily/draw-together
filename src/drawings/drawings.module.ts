import { Module } from '@nestjs/common';

import { DrawingsService } from './drawings.service';

@Module({
  providers: [DrawingsService],
})
export class DrawingsModule {}
