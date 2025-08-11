import { AnimalSex } from '@caniparadis/dtos/dist/animalDto';
import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { UserEntity } from '../user/userEntity';
import { AnimalEntity } from './animal.entity';
import { AnimalService } from './animal.service';

const mockAnimalRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('AnimalService', () => {
  let service: AnimalService;
  let animalRepo: jest.Mocked<Repository<AnimalEntity>>;
  let userRepo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalService,
        {
          provide: getRepositoryToken(AnimalEntity),
          useFactory: mockAnimalRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AnimalService>(AnimalService);
    animalRepo = module.get(getRepositoryToken(AnimalEntity));
    userRepo = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new animal', async () => {
      const input = {
        name: 'Rex',
        type: 'dog',
        breed: 'malinois',
        ownerId: 1,
        sex: AnimalSex.MALE,
        isSterilized: true,
      };

      const user = { id: 1 } as UserEntity;
      const createdAnimal = { ...input, id: 123, owner: user } as AnimalEntity;

      userRepo.findOne.mockResolvedValue(user);
      animalRepo.create.mockReturnValue(createdAnimal);
      animalRepo.save.mockResolvedValue(createdAnimal);

      const result = await service.create(input);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: input.ownerId } });
      expect(animalRepo.create).toHaveBeenCalledWith({ ...input, owner: user });
      expect(animalRepo.save).toHaveBeenCalledWith(createdAnimal);
      expect(result).toEqual(createdAnimal);
    });

    it('should throw NotFoundException if owner does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          name: 'Rex',
          type: 'dog',
          breed: 'malinois',
          ownerId: 999,
          sex: AnimalSex.MALE,
          isSterilized: true,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return an animal if found', async () => {
      const animal = { id: 1, name: 'Rex' } as AnimalEntity;
      animalRepo.findOne.mockResolvedValue(animal);

      const result = await service.findById(1);
      expect(result).toEqual(animal);
    });

    it('should throw NotFoundException if not found', async () => {
      animalRepo.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return the animal', async () => {
      const animal = { id: 1, name: 'Rex' } as AnimalEntity;
      jest.spyOn(service, 'findById').mockResolvedValue(animal);
      animalRepo.remove.mockResolvedValue(animal);

      const result = await service.remove(1);
      expect(result).toEqual(animal);
    });
  });
});
