import { ApiProperty } from '@nestjs/swagger';

export class TypeRoom {
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
    description: 'The description of the type_room',
    example: 'Test description',
  })
  description: string;

  // @ApiProperty({
  //   description: 'The image of type_room',
  // })
  // image: Image;
}

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

export class ResGetTypeRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'List of users' })
  type_rooms: TypeRoom[];
}

export class ResGetTypeRoomDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'List of users' })
  type_room: TypeRoom;
}

export class ResCreateTypeRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  type_room: TypeRoom;
}

export class ResUpdateTypeRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  type_room: TypeRoom;
}

export class ResDeleteTypeRoomsDto {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  ok?: boolean;

  @ApiProperty({ description: 'Message of the request' })
  message?: string;

  @ApiProperty({ description: 'New user created' })
  type_room: TypeRoom;
}
