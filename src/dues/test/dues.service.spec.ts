import { Test, TestingModule } from '@nestjs/testing';
import { DuesService } from '../dues.service';

describe('DuesService', () => {
  let service: DuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DuesService],
    }).compile();

    service = module.get<DuesService>(DuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
