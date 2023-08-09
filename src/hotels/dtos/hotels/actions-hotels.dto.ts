import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { RoleEnum } from '../../../constants/role.model';
import { CityEnum } from '../../../constants/city.model';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateHotelsDto {
  @ApiProperty({
    description: 'The email of the hotel',
    type: 'string',
    format: 'email',
    example: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
  })
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'The name of the hotel',
    type: 'string',
    example: 'Test',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'The description of the hotel',
    type: 'string',
    example: 'Test',
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    description: 'The address of the hotel',
    type: 'string',
    example: 'Test',
  })
  @IsString()
  @MinLength(1)
  address: string;

  @ApiProperty({
    description: 'rating of the hotel',
    type: 'string',
    example: 5,
  })
  @IsString()
  @MinLength(1)
  rating: string;

  @ApiProperty({
    description: 'The city of the hotel',
    type: 'string',
    example: CityEnum.AREQUIPA,
    enum: CityEnum,
  })
  @IsEnum(CityEnum)
  city: CityEnum;

  @IsOptional()
  @ApiProperty({
    description: 'The image files of the hotel',
    format: 'binary',
    required: false,
  })
  images: Express.Multer.File[];
}

export class UpdateHotelsDto extends PartialType(
  OmitType(CreateHotelsDto, ['email', 'images'] as const),
) {}
