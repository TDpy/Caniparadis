import {
  type PaymentStatus,
  type ReservationStatus,
} from '@caniparadis/dtos/dist/reservationDto';

export interface CreateReservation {
  animalId: number;
  endDate: string;
  serviceTypeId: number;
  startDate: string;
  comment?: string;
}

export interface UpdateReservation {
  amountPaid?: number;
  animalId?: number;
  comment?: string;
  endDate?: string;
  paymentStatus?: PaymentStatus;
  serviceTypeId?: number;
  startDate?: string;
  status?: ReservationStatus;
}

export interface ProposeNewSlot {
  endDate: string;
  startDate: string;
  comment?: string;
}

export interface UpdatePayment {
  status: PaymentStatus;
  amountPaid?: number;
}
