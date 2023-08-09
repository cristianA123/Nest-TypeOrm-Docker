import { Test, TestingModule } from '@nestjs/testing';
import { RoomQualitiesController } from './room_qualities.controller';

describe('SourceController', () => {
  let controller: RoomQualitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomQualitiesController],
    }).compile();

    controller = module.get<RoomQualitiesController>(RoomQualitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
