import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {ServiceTypeEntity} from "./service-type.entity";
import { CreateServiceType, UpdateServiceType } from './service-type.type';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceTypeEntity)
    private readonly serviceTypeRepository: Repository<ServiceTypeEntity>,
  ) {}

  create(createServiceType: CreateServiceType): Promise<ServiceTypeEntity> {
    return this.serviceTypeRepository.save(createServiceType);
  }

  findAll() {
    return this.serviceTypeRepository.find({ order: { id: 'ASC' } });
  }

  async findById(id: number) {
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id },
    });
    if (!serviceType) throw new NotFoundException(`Service type with id ${id} not found`);
    return serviceType;
  }

  async update(id: number, updateServiceType: UpdateServiceType) {
    const existingServiceType = await this.findById(id);
    const merged = this.serviceTypeRepository.merge(
      existingServiceType,
      updateServiceType,
    );
    return this.serviceTypeRepository.save(merged);
  }

  async remove(id: number) {
    const existingServiceType = await this.findById(id);
    return this.serviceTypeRepository.remove(existingServiceType);
  }
}
