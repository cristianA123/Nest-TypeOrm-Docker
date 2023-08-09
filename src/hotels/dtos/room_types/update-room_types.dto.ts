import { PartialType } from '@nestjs/swagger';
import { CreateRoomTypesDto } from './create-room_types.dto';

export class UpdateRoomTypesDto extends PartialType(CreateRoomTypesDto) {}
