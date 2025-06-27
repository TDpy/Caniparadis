import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString,} from 'class-validator';
import {PartialType} from '@nestjs/mapped-types';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  RESET_TOKEN = 'RESET_TOKEN',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
}

export class UserDto {
  id: number;
  email: string;
  role: Role;
}
