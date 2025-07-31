import { Test, TestingModule } from '@nestjs/testing';
import { RolesNoSpecController } from './roles--no-spec.controller';
import { RolesNoSpecService } from './roles--no-spec.service';

describe('RolesNoSpecController', () => {
  let controller: RolesNoSpecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesNoSpecController],
      providers: [RolesNoSpecService],
    }).compile();

    controller = module.get<RolesNoSpecController>(RolesNoSpecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
