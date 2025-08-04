import { SharedLoginDto } from '@caniparadis/dtos/dist/authDto';
import { SharedSignUpDto } from '@caniparadis/dtos/dist/authDto';
import { SharedEmailDto } from '@caniparadis/dtos/dist/authDto';
import { SharedPasswordDto } from '@caniparadis/dtos/dist/authDto';
import { SharedTokenDto } from '@caniparadis/dtos/dist/authDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements SharedLoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignUpDto implements SharedSignUpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class EmailDto implements SharedEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class PasswordDto implements SharedPasswordDto {
  @ApiProperty({ example: 'newStrongPassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenDto implements SharedTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsNotEmpty()
  @IsString()
  token: string;
}
