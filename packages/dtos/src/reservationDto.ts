import {SharedAnimalDto} from './animalDto';
import {SharedServiceTypeDto} from './serviceTypeDto';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROPOSED = 'PROPOSED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export interface SharedCreateReservationDto {
  animalId: number;
  serviceTypeId: number;
  startDate: string;
  endDate: string;
  comment?: string;
}

export interface SharedUpdateReservationDto extends Partial<SharedCreateReservationDto> {
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
}

export interface SharedReservationDto {
  id: number;
  animal: SharedAnimalDto;
  serviceType: SharedServiceTypeDto;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  amountPaid?: number;
  comment?: string;
}

export interface SharedSearchReservationCriteriaDto {
  fromDate?: Date;
  toDate?: Date;
  userId?: number;
  paymentStatus?: PaymentStatus;
}

export interface SharedProposeNewSlotDto {
  startDate: string;
  endDate: string;
  comment?: string;
}

export interface SharedUpdatePaymentDto {
  status?: PaymentStatus;
  amountPaid?: number;
}
