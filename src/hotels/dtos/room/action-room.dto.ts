import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    description: 'The name of the room',
    type: 'string',
    example: 'Test room',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the room',
    type: 'number',
    example: 100,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The available of the room',
    type: 'boolean',
    example: true,
  })
  @IsBoolean()
  available: boolean;

  @ApiProperty({
    description: 'The hotel of the room',
    type: 'string',
    example: 'Test hotel',
  })
  @IsString()
  hotel: string;

  @ApiProperty({
    description: 'The type of the room',
    type: 'string',
    example: 'Test type',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'The qualities of the room',
    isArray: true,
    type: 'string',
    // items: {
    //   type: 'string',
    //   example: 'Test quality',
    // },
  })
  @IsString({ each: true })
  qualities: string;

  @IsOptional()
  @ApiProperty({
    description: 'The image files of the hotel',
    format: 'binary',
    required: false,
  })
  images: Express.Multer.File[];
}

export class UpdateRoomDto extends PartialType(
  OmitType(CreateRoomDto, ['hotel', 'type'] as const),
) {}
