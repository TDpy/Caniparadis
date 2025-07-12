import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceTypeController } from './service-type.controller';
import { ServiceTypeEntity } from './service-type.entity';
import { ServiceTypeService } from './service-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceTypeEntity])],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
})
export class ServiceTypeModule {}
