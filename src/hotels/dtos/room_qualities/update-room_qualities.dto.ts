import { PartialType } from '@nestjs/swagger';
import { CreateRoomQualitiesDto } from './create-room_qualities.dto';

export class UpdateRoomQualitiesDto extends PartialType(
  CreateRoomQualitiesDto,
) {}
