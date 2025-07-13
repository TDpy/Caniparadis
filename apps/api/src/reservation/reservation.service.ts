import { ReservationStatus } from '@caniparadis/dtos/dist/reservationDto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { ServiceTypeEntity } from '../service-type/service-type.entity';
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

    const reservation = this.reservationRepository.create({
      ...createReservation,
      animal,
      serviceType,
    });
    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<ReservationEntity[]> {
    return this.reservationRepository.find({
      relations: ['animal', 'serviceType'],
      order: { id: 'ASC' },
    });
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

  async accept(id: number) {
    const reservation = await this.findOne(id);

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

    reservation.status = ReservationStatus.CANCELLED;
    return this.reservationRepository.save(reservation);
  }

  async proposeNewSlot(id: number, dto: ProposeNewSlot) {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot propose slot for cancelled reservation',
      );
    }

    reservation.startDate = new Date(dto.startDate);
    reservation.endDate = new Date(dto.endDate);
    reservation.status = ReservationStatus.PROPOSED;
    reservation.comment = dto.comment ?? null;

    return this.reservationRepository.save(reservation);
  }

  async updatePayment(id: number, dto: UpdatePayment) {
    const reservation = await this.findOne(id);

    reservation.paymentStatus = dto.status;

    if (dto.amountPaid !== undefined) {
      reservation.amountPaid = +dto.amountPaid + +reservation.amountPaid
    }

    return this.reservationRepository.save(reservation);
  }
}
