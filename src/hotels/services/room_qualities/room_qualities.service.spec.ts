import { Test, TestingModule } from '@nestjs/testing';
import { RoomQualitiesService } from './room_qualities.service';

describe('SourceService', () => {
  let service: RoomQualitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomQualitiesService],
    }).compile();

    service = module.get<RoomQualitiesService>(RoomQualitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
