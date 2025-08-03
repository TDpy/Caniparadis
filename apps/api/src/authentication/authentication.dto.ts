import { SharedLoginDto } from '@caniparadis/dtos/dist/authDto';
import { SharedSignUpDto } from '@caniparadis/dtos/dist/authDto';
import { SharedEmailDto } from '@caniparadis/dtos/dist/authDto';
import { SharedPasswordDto } from '@caniparadis/dtos/dist/authDto';
import { SharedTokenDto } from '@caniparadis/dtos/dist/authDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements SharedLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignUpDto implements SharedSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class EmailDto implements SharedEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}


export class PasswordDto implements SharedPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenDto implements SharedTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
