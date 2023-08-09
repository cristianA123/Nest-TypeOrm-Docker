import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'The email of the user',
    format: 'email',
    example: `c3m.software.solutions@gmail.com`,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    minLength: 6,
    maxLength: 50,
    pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])',
    example: 'c3mSoftwareSolutions',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}

export class SignupUserDto {
  @ApiProperty({
    description: 'The email of the user',
    format: 'email',
    example: `test${Math.floor(Math.random() * 1000000)}@gmail.com`,
  })
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
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
}
