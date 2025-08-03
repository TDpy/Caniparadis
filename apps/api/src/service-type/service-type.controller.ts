import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import {CreateServiceTypeDto, UpdateServiceTypeDto} from "./service-type.dto";
import {ServiceTypeMapper} from "./service-type.mapper";
import { ServiceTypeService } from './service-type.service';

@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Post()
  async create(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    const serviceType = await this.serviceTypeService.create({ ...createServiceTypeDto });
    return ServiceTypeMapper.toDto(serviceType);
  }

  @Get()
  async findAll() {
    const serviceType = await this.serviceTypeService.findAll();
    return ServiceTypeMapper.toDtos(serviceType);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const serviceType = await this.serviceTypeService.findById(+id);
    return ServiceTypeMapper.toDto(serviceType);

  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
  ) {
    const serviceType = await this.serviceTypeService.update(+id, { ...updateServiceTypeDto });
    return ServiceTypeMapper.toDto(serviceType);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const serviceType = await this.serviceTypeService.remove(+id);
    return ServiceTypeMapper.toDto(serviceType);
  }
}
