import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { EmailService } from '../email/email.service';
import { ReservationEntity } from '../reservation/reservation.entity';
import { ReservationService } from '../reservation/reservation.service';
import { ServiceTypeEntity } from '../service-type/service-type.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/userEntity';
import { DateUtilsService } from '../utils/date-utils.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  providers: [
    DashboardService,
    ReservationService,
    EmailService,
    DateUtilsService,
    UserService,
  ],
  controllers: [DashboardController],
  imports: [
    TypeOrmModule.forFeature([
      ReservationEntity,
      AnimalEntity,
      ServiceTypeEntity,
      UserEntity,
    ]),
  ],
})
export class DashboardModule {}
