import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export enum AnimalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class CreateAnimalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  breed: string;

  @IsNotEmpty()
  @IsNumber()
  ownerId: number;

  @IsNotEmpty()
  @IsEnum(AnimalSex)
  sex: AnimalSex;

  @IsNotEmpty()
  @IsBoolean()
  isSterilized: boolean;
}

export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {}

export class AnimalDto {
  id: number;
  name: string;
  type: string;
  breed: string;
  sex: AnimalSex;
  isSterilized: boolean;
  ownerId: number;
}
