import { SharedAnimalDto } from '@caniparadis/dtos/dist/animalDto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AnimalDto, CreateAnimalDto, UpdateAnimalDto } from './animal.dto';
import { AnimalMapper } from './animal.mapper';
import { AnimalService } from './animal.service';

@ApiTags('Animals')
@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateAnimalDto })
  @ApiCreatedResponse({ type: AnimalDto })
  async create(@Body() dto: CreateAnimalDto): Promise<SharedAnimalDto> {
    const data = await this.animalService.create({ ...dto });
    return AnimalMapper.toDto(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: [AnimalDto] })
  async findAll(): Promise<SharedAnimalDto[]> {
    const data = await this.animalService.findAll();
    return AnimalMapper.toDtos(data);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AnimalDto })
  async findOne(@Param('id') id: string): Promise<SharedAnimalDto> {
    const data = await this.animalService.findById(+id);
    return AnimalMapper.toDto(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateAnimalDto })
  @ApiCreatedResponse({ type: AnimalDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnimalDto,
  ): Promise<SharedAnimalDto> {
    const data = await this.animalService.update(+id, { ...dto });
    return AnimalMapper.toDto(data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AnimalDto })
  async remove(@Param('id') id: string): Promise<SharedAnimalDto> {
    const data = await this.animalService.remove(+id);
    return AnimalMapper.toDto(data);
  }
}
