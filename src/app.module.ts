import { Module } from '@nestjs/common';
import { DrawingsModule } from './drawings/drawings.module';

@Module({
  imports: [DrawingsModule],
})
export class AppModule {}
