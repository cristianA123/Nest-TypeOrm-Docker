import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { RoleEnum, SourceEnum } from '../../../constants';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    type: 'string',
    format: 'email',
    example: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
  })
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: 'string',
    minLength: 6,
    maxLength: 50,
    pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])',
    example: 'Test1234!',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'Test',
  })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Test',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    description: 'The phone of the user',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The age of the user',
    example: '20',
    required: false,
  })
  @IsOptional()
  @IsString()
  age: string;

  @ApiProperty({
    description: 'The role of the user',
    type: 'string',
    example: RoleEnum.USER,
    enum: RoleEnum,
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @ApiProperty({
    description: 'The source of the user',
    example: SourceEnum.EMAIL,
    enum: SourceEnum,
  })
  @IsEnum(SourceEnum)
  source: SourceEnum;

  @IsOptional()
  @ApiProperty({
    description: 'The file of the Image to upload',
    format: 'binary',
    type: 'string',
    example: 'Test',
    required: false,
  })
  image: Express.Multer.File;
}

export class UpdatedUserImageDto {
  @ApiProperty({
    description: 'The file of the Image to upload',
    format: 'binary',
    type: 'string',
    example: 'Test.png',
  })
  image: Express.Multer.File;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['image', 'password', 'email'] as const),
) {}

export class CreateUserGoogleDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @IsString()
  @MinLength(1)
  accessToken?: string;

  @IsString()
  @MinLength(1)
  refreshToken?: string;
}
