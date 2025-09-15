import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { ReservationService } from '../reservation/reservation.service';
import { ServiceTypeEntity } from '../service-type/service-type.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  providers: [DashboardService, ReservationService],
  controllers: [DashboardController],
  imports: [
    TypeOrmModule.forFeature([
      ReservationEntity,
      AnimalEntity,
      ServiceTypeEntity,
    ]),
  ],
})
export class DashboardModule {}
