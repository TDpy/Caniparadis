import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { ServiceTypeEntity } from '../service-type/service-type.entity';
import { ReservationController } from './reservation.controller';
import { ReservationEntity } from './reservation.entity';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReservationEntity,
      AnimalEntity,
      ServiceTypeEntity,
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
