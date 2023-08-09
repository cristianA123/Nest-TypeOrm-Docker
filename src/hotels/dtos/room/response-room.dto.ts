import { ApiProperty } from '@nestjs/swagger';
import { Image, Quality } from '../quality/response-quality.dto';

class TypeBase {
  @ApiProperty({ description: 'The id of image', example: '1' })
  id: number;

  @ApiProperty({
    description: 'The name of image',
    example: 'example',
  })
  name: string;
}

class RoomBase {
  @ApiProperty({
    description: 'The id of the room',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the room',
    example: `test`,
  })
  name: string;

  @ApiProperty({
    description: 'The price of the room',
    example: '100',
  })
  price: number;

  @ApiProperty({
    description: 'The avaliable of the room',
    example: 'true',
  })
  available: boolean;

  @ApiProperty({
    description: 'The type of room',
  })
  type: TypeBase;

  @ApiProperty({
    description: 'The rooms of room',
    example: 'Test description',
  })
  qualities: Quality[];

  @ApiProperty({
    description: 'The image of rooom',
    example: 'Test description',
  })
  images: Image[];
}

export class ResGetRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'List of users' })
  rooms: RoomBase[];
}

export class ResGetRoomDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'List of users' })
  room: RoomBase;
}

export class ResCreateRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  room: RoomBase;
}

export class ResUpdateRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  room: RoomBase;
}

export class ResDeleteRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  room: RoomBase;
}
