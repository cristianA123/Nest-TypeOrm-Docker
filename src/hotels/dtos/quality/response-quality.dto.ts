import { ApiProperty } from '@nestjs/swagger';

export class Image {
  @ApiProperty({ description: 'The id of image', example: '1' })
  id: number;
  @ApiProperty({
    description: 'The name of image',
    example: 'example',
  })
  name: string;
  @ApiProperty({
    description: 'The image url',
    example: 'https://placeholder.com/500/500',
  })
  url: string;
}

export class Quality {
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The email of the user',
    example: `test`,
  })
  name: string;

  @ApiProperty({
    description: 'The description of the quality',
    example: 'Test description',
  })
  description: string;

  @ApiProperty({
    description: 'The image of quality',
  })
  image: Image;
}

export class ResGetQualitiesDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'List of users' })
  qualities: Quality[];
}

export class ResGetQualityDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'List of users' })
  quality: Quality;
}

export class ResCreateQualitiesDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  quality: Quality;
}

export class ResUpdateQualitiesDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  quality: Quality;
}

export class ResDeleteQualitiesDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  quality: Quality;
}
