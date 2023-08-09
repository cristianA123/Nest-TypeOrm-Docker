import { ApiProperty } from '@nestjs/swagger';

class UserBase {
  @ApiProperty({
    description: 'The id of the user',
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The email of the user',
    type: 'string',
    format: 'email',
    example: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
  })
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    type: 'string',
    example: 'Test',
  })
  name: string;

  @ApiProperty({
    description: 'The image of the user',
    type: 'string',
    example:
      'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623168233/avatars/1623168232.jpg',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'The status of the user',
    type: 'boolean',
    example: true,
    required: false,
  })
  status?: boolean;
}

export class ResGetUserDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'User found',
  })
  message?: string;

  @ApiProperty({
    description: 'User data',
    type: UserBase,
    example: {
      id: 1,
      email: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
      name: 'Test',
      status: true,
    },
  })
  user: UserBase;
}

export class ResGetUsersDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'Users found',
  })
  message?: string;

  @ApiProperty({
    description: 'Users data',
    type: UserBase,
    isArray: true,
    example: [
      {
        id: 1,
        email: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
        name: 'Test',
        status: true,
      },
    ],
  })
  users: UserBase[];
}

export class ResCreateUserDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'User created',
  })
  message?: string;

  @ApiProperty({
    description: 'New user created',
    type: UserBase,
    example: {
      id: 1,
      email: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
      name: 'Test',
      status: true,
    },
  })
  user: UserBase;
}

export class ResDeleteUserDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'User deleted',
  })
  message?: string;

  @ApiProperty({
    description: 'User deleted',
    type: UserBase,
    example: {
      id: 1,
      email: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
      name: 'Test',
      status: true,
    },
  })
  user: UserBase;
}

export class ResUpdateUserDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    example: 'User updated',
  })
  message?: string;

  @ApiProperty({
    description: 'User updated',
    example: {
      id: 1,
      email: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
      name: 'Test',
      status: true,
    },
  })
  user: UserBase;
}

export class ImageBase {
  @ApiProperty({
    description: 'The id of the image',
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the image',
    type: 'string',
    example: 'Test',
  })
  name: string;

  @ApiProperty({
    description: 'The url of the image',
    type: 'string',
    example:
      'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
  })
  secure_url: string;

  @ApiProperty({
    description: 'The status of the image',
    type: 'boolean',
    example: true,
  })
  status?: boolean;
}

export class ResUpdateUserImageDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'Image updated',
  })
  message?: string;

  @ApiProperty({
    description: 'Image updated',
    type: ImageBase,
    example: {
      id: 1,
      name: 'Test',
      secure_url:
        'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
      status: true,
    },
  })
  image: ImageBase;
}
