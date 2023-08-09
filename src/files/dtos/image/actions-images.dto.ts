import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    description: 'The name of the Image',
    minLength: 3,
    maxLength: 50,
    example: 'Test',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The file of the Image to upload',
    format: 'binary',
    type: 'string',
    example: 'Test',
  })
  file: Express.Multer.File;
}

export class UpdateImageDto extends PartialType(CreateImageDto) {}
