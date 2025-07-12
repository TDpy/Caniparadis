import {PartialType} from "@nestjs/mapped-types";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateServiceTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateServiceTypeDto extends PartialType(CreateServiceTypeDto) {
}

export class ServiceTypeDto {
  id: number;
  name: string;
  description: string;
}
