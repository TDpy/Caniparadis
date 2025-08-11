import { SharedServiceTypeDto } from '@caniparadis/dtos/dist/serviceTypeDto'; // DTO interne
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

import {CheckAdminGuard} from "../guard/admin.guard";
import {
  CreateServiceTypeDto,
  ServiceTypeDto,
  UpdateServiceTypeDto,
} from './service-type.dto';
import { ServiceTypeMapper } from './service-type.mapper';
import { ServiceTypeService } from './service-type.service';

@ApiTags('Service Types')
@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Post()
  @UseGuards(CheckAdminGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateServiceTypeDto })
  @ApiCreatedResponse({
    type: ServiceTypeDto,
  })
  async create(
    @Body() createServiceTypeDto: CreateServiceTypeDto,
  ): Promise<SharedServiceTypeDto> {
    const serviceType = await this.serviceTypeService.create({
      ...createServiceTypeDto,
    });
    return ServiceTypeMapper.toDto(serviceType);
  }

  @Get()
  @Public()
  @ApiCreatedResponse({
    type: [ServiceTypeDto],
  })
  async findAll(): Promise<SharedServiceTypeDto[]> {
    const serviceTypes = await this.serviceTypeService.findAll();
    return ServiceTypeMapper.toDtos(serviceTypes);
  }

  @Get(':id')
  @Public()
  @ApiCreatedResponse({
    type: ServiceTypeDto,
  })
  async findOne(@Param('id') id: string): Promise<SharedServiceTypeDto> {
    const serviceType = await this.serviceTypeService.findById(+id);
    return ServiceTypeMapper.toDto(serviceType);
  }

  @Patch(':id')
  @UseGuards(CheckAdminGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateServiceTypeDto })
  @ApiCreatedResponse({
    type: ServiceTypeDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
  ): Promise<SharedServiceTypeDto> {
    const serviceType = await this.serviceTypeService.update(+id, {
      ...updateServiceTypeDto,
    });
    return ServiceTypeMapper.toDto(serviceType);
  }

  @Delete(':id')
  @UseGuards(CheckAdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ServiceTypeDto,
  })
  async remove(@Param('id') id: string): Promise<SharedServiceTypeDto> {
    const serviceType = await this.serviceTypeService.remove(+id);
    return ServiceTypeMapper.toDto(serviceType);
  }
}
