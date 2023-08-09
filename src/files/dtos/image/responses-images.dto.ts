import { ApiProperty } from '@nestjs/swagger';

class Image {
  @ApiProperty({
    description: 'The id of the Image',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the Image',
    example: 'Test',
  })
  name: string;

  @ApiProperty({
    description: 'The url of the Image',
    example: 'Test',
  })
  secure_url: string;

  @ApiProperty({
    description: 'The status of the Image',
    example: true,
  })
  status: boolean;
}

export class ResGetImageDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  ok: boolean;

  @ApiProperty({
    description: 'Message of the request',
    example: 'Image retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Image retrieved successfully',
    example: {
      id: 1,
      name: 'Test',
      secure_url: 'https://placehold.it/300x300',
      status: true,
    },
  })
  image: Image;
}

export class ResGetImagesDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  ok: boolean;

  @ApiProperty({
    description: 'Message of the request',
    example: 'Images retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of Images',
    example: [
      {
        id: 1,
        name: 'Test',
        secure_url: 'https://placehold.it/300x300',
        status: true,
      },
      {
        id: 2,
        name: 'Test',
        secure_url: 'https://placehold.it/300x300',
        status: true,
      },
    ],
  })
  images: Image[];
}

export class ResCreateImageDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message: string;

  @ApiProperty({ description: 'New Image created successfully' })
  image: Image;
}

export class ResDeleteImageDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  ok: boolean;

  @ApiProperty({
    description: 'Message of the request',
    example: 'Image deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Image deleted successfully',
    example: {
      id: 1,
      name: 'Test',
      secure_url: 'https://placehold.it/300x300',
      status: true,
    },
  })
  image: Image;
}

export class ResUpdateImageDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  ok: boolean;

  @ApiProperty({
    description: 'Message of the request',
    example: 'Image deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Image deleted successfully',
    example: {
      id: 1,
      name: 'Test',
      secure_url: 'https://placehold.it/300x300',
      status: true,
    },
  })
  image: Image;
}
