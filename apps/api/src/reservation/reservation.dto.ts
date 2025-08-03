import {
  ReservationStatus,
  SharedReservationDto,
  SharedUpdateReservationDto
} from '@caniparadis/dtos/dist/reservationDto';
import { SharedProposeNewSlotDto } from '@caniparadis/dtos/dist/reservationDto';
import { PaymentStatus, SharedUpdatePaymentDto } from '@caniparadis/dtos/dist/reservationDto';
import { SharedCreateReservationDto } from '@caniparadis/dtos/dist/reservationDto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  Min,
} from 'class-validator';
import { IsEnum } from 'class-validator';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import {AnimalDto} from "../animal/animal.dto";
import {ServiceTypeDto} from "../service-type/service-type.dto";

export class CreateReservationDto implements SharedCreateReservationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  animalId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceTypeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
export class UpdateReservationDto
  extends PartialType(CreateReservationDto)
  implements SharedUpdateReservationDto
{
  @ApiProperty({ required: false, enum: ReservationStatus })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiProperty({ required: false, enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;
}

export class ReservationDto implements SharedReservationDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: AnimalDto })
  animal: AnimalDto;

  @ApiProperty({ type: ServiceTypeDto })
  serviceType: ServiceTypeDto;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty({ enum: ReservationStatus })
  status: ReservationStatus;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty({ required: false })
  amountPaid?: number;

  @ApiProperty({ required: false })
  comment?: string;
}

export class ProposeNewSlotDto implements SharedProposeNewSlotDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdatePaymentDto implements SharedUpdatePaymentDto {
  @ApiProperty({ enum: PaymentStatus })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amountPaid?: number;
}
