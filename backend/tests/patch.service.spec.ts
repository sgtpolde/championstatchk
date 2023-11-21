import { PatchService } from 'src/patch/patch.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PatchService', () => {
  let patchService: PatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatchService],
    }).compile();

    patchService = module.get<PatchService>(PatchService);
  });

  it('should be defined', () => {
    expect(patchService).toBeDefined();
  });

  // Add your unit tests here
});

