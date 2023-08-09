import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateQualityDto {
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

  @ApiProperty({
    description: 'The image of the quality',
    example: 'Test image',
    format: 'binary',
    type: 'string',
  })
  image: any;
}

export class UpdateQualityDto extends PartialType(
  OmitType(CreateQualityDto, ['image'] as const),
) {}

export class UpdatedQualityImageDto {
  @ApiProperty({
    description: 'The file of the Image to upload',
    format: 'binary',
    type: 'string',
    example: 'Test.png',
  })
  image: Express.Multer.File;
}
