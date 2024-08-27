import { Module } from '@nestjs/common';

import { DrawingsGateway } from './drawings.gateway';
import { DrawingsService } from './drawings.service';

@Module({
  providers: [DrawingsGateway, DrawingsService],
})
export class DrawingsModule {}
