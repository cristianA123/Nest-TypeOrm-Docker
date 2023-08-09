import { Test, TestingModule } from '@nestjs/testing';
import { RoomTypeService } from './room_types.service';

describe('SourceService', () => {
  let service: RoomTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomTypeService],
    }).compile();

    service = module.get<RoomTypeService>(RoomTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
