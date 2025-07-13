import {PaymentStatus, ReservationStatus} from "@caniparadis/dtos/dist/reservationDto";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { ServiceTypeEntity } from '../service-type/service-type.entity';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AnimalEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'animalId' })
  animal: AnimalEntity;

  @ManyToOne(() => ServiceTypeEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'serviceTypeId' })
  serviceType: ServiceTypeEntity;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: null })
  amountPaid?: number | null;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;
}
