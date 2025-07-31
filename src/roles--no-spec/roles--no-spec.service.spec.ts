import { Test, TestingModule } from '@nestjs/testing';
import { RolesNoSpecService } from './roles--no-spec.service';

describe('RolesNoSpecService', () => {
  let service: RolesNoSpecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesNoSpecService],
    }).compile();

    service = module.get<RolesNoSpecService>(RolesNoSpecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
