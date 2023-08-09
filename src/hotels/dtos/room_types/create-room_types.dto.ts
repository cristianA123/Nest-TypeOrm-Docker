import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoomTypesDto {
  @ApiProperty({
    description: 'The name of the quality',
    example: 'Test quality',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The desciprtion of the quality',
    example: 'Test description',
  })
  @IsString()
  description: string;
}
