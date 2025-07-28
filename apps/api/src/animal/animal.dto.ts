import {
  AnimalSex,
  CreateAnimalDto as SharedCreateAnimalDto,
} from '@caniparadis/dtos/dist/animalDto';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

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
