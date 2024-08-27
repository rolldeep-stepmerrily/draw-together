import { Test, TestingModule } from '@nestjs/testing';
import { DrawingsService } from './drawings.service';

describe('DrawingsService', () => {
  let service: DrawingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawingsService],
    }).compile();

    service = module.get<DrawingsService>(DrawingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
