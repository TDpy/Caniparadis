import {
  AnimalSex,
  SharedAnimalDto,
  SharedCreateAnimalDto,
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

import { UserDto } from '../user/user.dto';

export class CreateAnimalDto implements SharedCreateAnimalDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Rex' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Dog' })
  type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Golden Retriever' })
  breed: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 12 })
  ownerId: number;

  @IsNotEmpty()
  @IsEnum(AnimalSex)
  @ApiProperty({ enum: AnimalSex, example: AnimalSex.MALE })
  sex: AnimalSex;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  isSterilized: boolean;
}

export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {}

export class AnimalDto implements SharedAnimalDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Rex' })
  name: string;

  @ApiProperty({ example: 'Dog' })
  type: string;

  @ApiProperty({ example: 'Golden Retriever' })
  breed: string;

  @ApiProperty({ enum: AnimalSex, example: AnimalSex.MALE })
  sex: AnimalSex;

  @ApiProperty({ example: true })
  isSterilized: boolean;

  @ApiProperty({ type: UserDto })
  owner: UserDto;
}
