import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import {
  HotelsController,
  RoomController,
  QualityController,
  RoomTypeController,
} from './controllers';
import {
  QualityService,
  HotelsService,
  RoomQualitiesService,
  RoomService,
  RoomTypeService,
} from './services';

@Module({
  controllers: [
    HotelsController,
    RoomController,
    QualityController,
    RoomTypeController,
  ],
  exports: [],
  imports: [AuthModule, FilesModule],
  providers: [
    HotelsService,
    QualityService,
    RoomQualitiesService,
    RoomService,
    RoomTypeService,
  ],
})
export class HotelsModule {}
