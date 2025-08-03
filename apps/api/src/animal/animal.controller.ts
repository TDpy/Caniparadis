import {
  SharedCreateAnimalDto,
  SharedUpdateAnimalDto,
} from '@caniparadis/dtos/dist/animalDto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AnimalMapper } from './animal.mapper';
import { AnimalService } from './animal.service';

@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  async create(@Body() dto: SharedCreateAnimalDto) {
    const data = await this.animalService.create({ ...dto });
    return AnimalMapper.toDto(data);
  }

  @Get()
  async findAll() {
    const data = await this.animalService.findAll();
    return AnimalMapper.toDtos(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.animalService.findById(+id);
    return AnimalMapper.toDto(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: SharedUpdateAnimalDto) {
    const data = await this.animalService.update(+id, { ...dto });
    return AnimalMapper.toDto(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.animalService.remove(+id);
    return AnimalMapper.toDto(data);
  }
}
