import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The email of the user',
    example: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Test',
  })
  name: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'The image of the user',
    example: 'https://i.imgur.com/3Gv7kc8.png',
  })
  image: string;
}

export class ResLoginDto {
  @ApiProperty()
  ok?: boolean;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class ResRefreshDto {
  @ApiProperty()
  ok?: boolean;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class ResLogOutnDto {
  @ApiProperty()
  ok?: boolean;

  @ApiProperty()
  message?: string;
}
