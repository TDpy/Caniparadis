import {PartialType} from "@nestjs/mapped-types";
import {IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min} from "class-validator";

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROPOSED = 'PROPOSED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  animalId: number;

  @IsNotEmpty()
  @IsNumber()
  serviceTypeId: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;
}

export class ReservationDto {
  id: number;
  animalId: number;
  serviceTypeId: number;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  amountPaid?: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export class ProposeNewSlotDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdatePaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
  @IsNumber()
  amountPaid?: number;
}
