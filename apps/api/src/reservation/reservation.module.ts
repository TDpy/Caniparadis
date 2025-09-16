import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { EmailService } from '../email/email.service';
import { ServiceTypeEntity } from '../service-type/service-type.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/userEntity';
import { DateUtilsService } from '../utils/date-utils.service';
import { ReservationController } from './reservation.controller';
import { ReservationEntity } from './reservation.entity';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReservationEntity,
      AnimalEntity,
      ServiceTypeEntity,
      UserEntity,
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, EmailService, DateUtilsService, UserService],
})
export class ReservationModule {}
