import {
  PaymentStatus,
  ReservationStatus,
  SharedCreateReservationDto,
  SharedProposeNewSlotDto,
  SharedReservationDto,
  SharedSearchReservationCriteriaDto,
  SharedUpdatePaymentDto,
  SharedUpdateReservationDto,
} from '@caniparadis/dtos/dist/reservationDto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { AnimalDto } from '../animal/animal.dto';
import { ServiceTypeDto } from '../service-type/service-type.dto';

export class CreateReservationDto implements SharedCreateReservationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  animalId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  serviceTypeId: number;

  @ApiProperty({ example: '2025-08-01T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-08-01T12:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    required: false,
    example: "Retard possible suite examen de l'animal",
  })
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

  @ApiProperty({ required: false, minimum: 0, example: 50.08 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;
}

export class ReservationDto implements SharedReservationDto {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ type: AnimalDto })
  animal: AnimalDto;

  @ApiProperty({ type: ServiceTypeDto })
  serviceType: ServiceTypeDto;

  @ApiProperty({ example: '2025-08-01T10:00:00Z' })
  startDate: string;

  @ApiProperty({ example: '2025-08-01T12:00:00Z' })
  endDate: string;

  @ApiProperty({ enum: ReservationStatus })
  status: ReservationStatus;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty({ required: false, example: 50.08 })
  amountPaid?: number;

  @ApiProperty({
    required: false,
    example: "Retard possible suite examen de l'animal",
  })
  comment?: string;
}

export class ProposeNewSlotDto implements SharedProposeNewSlotDto {
  @ApiProperty({ example: '2025-08-02T09:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-08-02T11:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false, example: 'Revenez vers nous si besoin' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdatePaymentDto implements SharedUpdatePaymentDto {
  @ApiProperty({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ required: false, example: 50.08 })
  @IsOptional()
  @IsNumber()
  amountPaid?: number;
}

export class SearchReservationDto
  implements SharedSearchReservationCriteriaDto
{
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
