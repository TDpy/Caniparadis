import { SharedServiceTypeDto } from '@caniparadis/dtos/dist/serviceTypeDto';
import { SharedCreateServiceTypeDto } from '@caniparadis/dtos/dist/serviceTypeDto';
import { SharedUpdateServiceTypeDto } from '@caniparadis/dtos/dist/serviceTypeDto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceTypeDto implements SharedCreateServiceTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateServiceTypeDto
  extends PartialType(CreateServiceTypeDto)
  implements SharedUpdateServiceTypeDto {}

export class ServiceTypeDto implements SharedServiceTypeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
