import { Test, TestingModule } from '@nestjs/testing';
import { DuesController } from '../dues.controller';

describe('DuesController', () => {
  let controller: DuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DuesController],
    }).compile();

    controller = module.get<DuesController>(DuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
