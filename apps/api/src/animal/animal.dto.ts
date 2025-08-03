import {
  AnimalSex,
  SharedAnimalDto, SharedCreateAnimalDto,
} from '@caniparadis/dtos/dist/animalDto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import {UserDto} from "../user/user.dto";

export class CreateAnimalDto implements SharedCreateAnimalDto {
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

export class AnimalDto implements SharedAnimalDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  breed: string;
  @ApiProperty()
  sex: AnimalSex;
  @ApiProperty()
  isSterilized: boolean;
  @ApiProperty()
  owner: UserDto;
}
