import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/userEntity';
import { AnimalEntity } from './animal.entity';
import { CreateAnimalInput, UpdateAnimalInput } from './animal.type';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(AnimalEntity)
    private readonly animalRepository: Repository<AnimalEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(input: CreateAnimalInput): Promise<AnimalEntity> {
    const owner = await this.userRepository.findOne({ where: { id: input.ownerId } });
    if (!owner) {
      throw new NotFoundException(`User with ID ${input.ownerId} not found`);
    }

    const animal = this.animalRepository.create({
      ...input,
      owner,
    });

    return this.animalRepository.save(animal);
  }

  async findAll(): Promise<AnimalEntity[]> {
    return this.animalRepository.find({ relations: ['owner'] });
  }

  async findById(id: number): Promise<AnimalEntity> {
    const animal = await this.animalRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }
    return animal;
  }

  async update(id: number, input: UpdateAnimalInput): Promise<AnimalEntity> {
    const animal = await this.findById(id);

    if (input.ownerId && input.ownerId !== animal.owner.id) {
      const newOwner = await this.userRepository.findOne({ where: { id: input.ownerId } });
      if (!newOwner) {
        throw new NotFoundException(`User with ID ${input.ownerId} not found`);
      }
      animal.owner = newOwner;
    }

    Object.assign(animal, {
      ...input,
      owner: animal.owner,
    });

    return this.animalRepository.save(animal);
  }

  async remove(id: number): Promise<AnimalEntity> {
    const animal = await this.findById(id);
    await this.animalRepository.remove(animal);
    return animal;
  }
}
