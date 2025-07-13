import { type ReservationDto } from '@caniparadis/dtos/dist/reservationDto';

import { AnimalMapper } from '../animal/animal.mapper';
import { ServiceTypeMapper } from '../service-type/service-type.mapper';
import { type ReservationEntity } from './reservation.entity';

export const ReservationMapper = {
  toDto(reservation: ReservationEntity): ReservationDto {
    return {
      id: reservation.id,
      animal: AnimalMapper.toDto(reservation.animal),
      serviceType: ServiceTypeMapper.toDto(reservation.serviceType),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      status: reservation.status,
      paymentStatus: reservation.paymentStatus,
      amountPaid: reservation.amountPaid,
      comment: reservation.comment,
    };
  },

  toDtos(reservations: ReservationEntity[]): ReservationDto[] {
    return reservations.map((reservation) => this.toDto(reservation));
  },
};
