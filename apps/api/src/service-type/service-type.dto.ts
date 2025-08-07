import {
  SharedCreateServiceTypeDto,
  SharedServiceTypeDto,
  SharedUpdateServiceTypeDto,
} from '@caniparadis/dtos/dist/serviceTypeDto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceTypeDto implements SharedCreateServiceTypeDto {
  @ApiProperty({ example: 'Balade en groupe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Organisé par X. 8 chiens au maximum' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 60.08 })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateServiceTypeDto
  extends PartialType(CreateServiceTypeDto)
  implements SharedUpdateServiceTypeDto {}

export class ServiceTypeDto implements SharedServiceTypeDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Balade en groupe' })
  name: string;

  @ApiProperty({ example: 'Organisé par X. 8 chiens au maximum' })
  description: string;

  @ApiProperty({ example: 60.08 })
  price: number;

}
