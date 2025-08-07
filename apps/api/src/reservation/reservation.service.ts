import {
  PaymentStatus,
  ReservationStatus,
} from '@caniparadis/dtos/dist/reservationDto';
import { Role } from '@caniparadis/dtos/dist/userDto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { ServiceTypeEntity } from '../service-type/service-type.entity';
import { UserEntity } from '../user/userEntity';
import { SearchReservationDto } from './reservation.dto';
import { ReservationEntity } from './reservation.entity';
import {
  CreateReservation,
  ProposeNewSlot,
  UpdatePayment,
  UpdateReservation,
} from './reservation.type';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(AnimalEntity)
    private readonly animalRepository: Repository<AnimalEntity>,
    @InjectRepository(ServiceTypeEntity)
    private readonly serviceTypeRepository: Repository<ServiceTypeEntity>,
  ) {}

  async create(
    createReservation: CreateReservation,
    user: UserEntity,
  ): Promise<ReservationEntity> {
    const animal = await this.animalRepository.findOne({
      where: { id: createReservation.animalId },
    });
    if (!animal) {
      throw new NotFoundException(
        `Animal with ID ${createReservation.animalId} not found`,
      );
    }
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id: createReservation.serviceTypeId },
    });
    if (!serviceType) {
      throw new NotFoundException(
        `Service type with ID ${createReservation.serviceTypeId} not found`,
      );
    }

    let status = ReservationStatus.PENDING;
    if (user.role === Role.ADMIN) {
      status = ReservationStatus.CONFIRMED;
    }
    const reservation = this.reservationRepository.create({
      ...createReservation,
      animal,
      serviceType,
      status,
    });
    reservation.startDate = new Date(createReservation.startDate);
    reservation.endDate = new Date(createReservation.endDate);
    return this.reservationRepository.save(reservation);
  }

  findAll(criteria: SearchReservationDto): Promise<ReservationEntity[]> {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.animal', 'animal')
      .leftJoinAndSelect('reservation.serviceType', 'serviceType')
      .leftJoinAndSelect('animal.owner', 'owner');

    if (criteria.fromDate) {
      query.andWhere('reservation.startDate >= :fromDate', {
        fromDate: criteria.fromDate,
      });
    }

    if (criteria.toDate) {
      query.andWhere('reservation.endDate <= :toDate', {
        toDate: criteria.toDate,
      });
    }

    if (criteria.userId) {
      query.andWhere('animal.ownerId = :userId', { userId: criteria.userId });
    }

    if (criteria.paymentStatus) {
      query.andWhere('reservation.paymentStatus = :paymentStatus', {
        paymentStatus: criteria.paymentStatus,
      });
    }

    query
      .orderBy('reservation.startDate', 'ASC')
      .addOrderBy('reservation.id', 'ASC');

    return query.getMany();
  }

  async findOne(id: number): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['animal', 'serviceType'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(
    id: number,
    updateReservation: UpdateReservation,
  ): Promise<ReservationEntity> {
    const reservation = await this.findOne(id);

    if (reservation.animal.id !== updateReservation.animalId) {
      const animal = await this.animalRepository.findOne({
        where: { id: updateReservation.animalId },
      });
      if (!animal) {
        throw new NotFoundException(
          `Animal with ID ${updateReservation.animalId} not found`,
        );
      }
      reservation.animal = animal;
    }
    if (reservation.animal.id !== updateReservation.animalId) {
      const serviceType = await this.serviceTypeRepository.findOne({
        where: { id: updateReservation.serviceTypeId },
      });
      if (!serviceType) {
        throw new NotFoundException(
          `Service type with ID ${updateReservation.serviceTypeId} not found`,
        );
      }
      reservation.serviceType = serviceType;
    }

    Object.assign(reservation, updateReservation);
    return this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<ReservationEntity> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
    return reservation;
  }

  async accept(id: number, user: UserEntity) {
    const reservation = await this.findOne(id);

    if (
      reservation.status === ReservationStatus.PENDING &&
      user.role !== Role.ADMIN
    ) {
      throw new BadRequestException(
        'Only admin can accept reservation under PENDING status',
      );
    }

    if (
      reservation.status !== ReservationStatus.PENDING &&
      reservation.status !== ReservationStatus.PROPOSED
    ) {
      throw new BadRequestException(
        'Only pending or proposed reservations can be accepted',
      );
    }

    reservation.status = ReservationStatus.CONFIRMED;
    return this.reservationRepository.save(reservation);
  }

  async cancel(id: number) {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    if (!reservation.amountPaid) {
      reservation.paymentStatus = PaymentStatus.REFUNDED;
    }

    reservation.status = ReservationStatus.CANCELLED;
    return this.reservationRepository.save(reservation);
  }

  async proposeNewSlot(id: number, dto: ProposeNewSlot, user: UserEntity) {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot propose slot for cancelled reservation',
      );
    }

    reservation.startDate = new Date(dto.startDate);
    reservation.endDate = new Date(dto.endDate);
    reservation.status =
      user.role === Role.ADMIN
        ? ReservationStatus.PROPOSED
        : ReservationStatus.PENDING;
    reservation.comment = dto.comment ?? null;

    return this.reservationRepository.save(reservation);
  }

  async updatePayment(id: number, dto: UpdatePayment) {
    if (!dto.amountPaid && !dto.status) {
      throw new BadRequestException(
        'Request must contain amount or payment status',
      );
    }

    const reservation = await this.findOne(id);

    if (reservation.paymentStatus === PaymentStatus.REFUNDED) {
      throw new BadRequestException(
        'Cannot modify a refunded reservation payment status or amount.',
      );
    }

    if (
      reservation.status !== ReservationStatus.CONFIRMED &&
      dto.status !== PaymentStatus.REFUNDED
    ) {
      throw new BadRequestException(
        'Cannot pay for reservation not yet confirmed',
      );
    }

    if (dto.status === PaymentStatus.REFUNDED) {
      reservation.paymentStatus = PaymentStatus.REFUNDED;
      return this.reservationRepository.save(reservation);
    }

    if (dto.amountPaid !== undefined) {
      reservation.amountPaid = +dto.amountPaid + +reservation.amountPaid;
    }

    if (reservation.amountPaid > reservation.serviceType.price) {
      throw new BadRequestException('Amount paid cannot exceed service price');
    }

    reservation.paymentStatus =
      reservation.amountPaid === reservation.serviceType.price
        ? PaymentStatus.PAID
        : PaymentStatus.PENDING;

    return this.reservationRepository.save(reservation);
  }
}
