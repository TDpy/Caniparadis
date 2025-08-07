import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { ServiceTypeEntity } from './service-type.entity';
import { ServiceTypeService } from './service-type.service';
import { type CreateServiceType, type UpdateServiceType } from './service-type.type';

const mockServiceTypeRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('ServiceTypeService', () => {
  let service: ServiceTypeService;
  let repo: jest.Mocked<Repository<ServiceTypeEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTypeService,
        {
          provide: getRepositoryToken(ServiceTypeEntity),
          useFactory: mockServiceTypeRepository,
        },
      ],
    }).compile();

    service = module.get<ServiceTypeService>(ServiceTypeService);
    repo = module.get(getRepositoryToken(ServiceTypeEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save and return a new service type', async () => {
      const input: CreateServiceType = { name: 'Toilettage', description: 'Description', price: 12.34 };
      const result = { id: 1, name: 'Toilettage', description: 'Description', price: 12.34 };

      repo.save.mockResolvedValue(result);

      const created = await service.create(input);

      expect(repo.save).toHaveBeenCalledWith(input);
      expect(created).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all service types ordered by id ASC', async () => {
      const list = [
        { id: 1, name: 'Toilettage', description: 'Description', price: 12.34 },
        { id: 2, name: 'Vétérinaire', description: 'Description', price: 12.34 },
      ];

      repo.find.mockResolvedValue(list);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
      expect(result).toEqual(list);
    });
  });

  describe('findById', () => {
    it('should return service type if found', async () => {
      const entity = { id: 1, name: 'Toilettage', description: 'Description', price: 12.34 };

      repo.findOne.mockResolvedValue(entity);

      const result = await service.findById(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(entity);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return updated service type', async () => {
      const existing = { id: 1, name: 'Toilettage', description: 'description', price: 12.34 };
      const update: UpdateServiceType = { name: 'Toilettage Deluxe', price: 12.34  };
      const merged = { id: 1, name: 'Toilettage Deluxe', description: 'description', price: 12.34 };

      jest.spyOn(service, 'findById').mockResolvedValue(existing);
      repo.merge.mockReturnValue(merged);
      repo.save.mockResolvedValue(merged);

      const result = await service.update(1, update);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(repo.merge).toHaveBeenCalledWith(existing, update);
      expect(repo.save).toHaveBeenCalledWith(merged);
      expect(result).toEqual(merged);
    });
  });

  describe('remove', () => {
    it('should remove and return removed service type', async () => {
      const entity = { id: 1, name: 'Toilettage', description: 'Description', price: 20.02};

      jest.spyOn(service, 'findById').mockResolvedValue(entity);
      repo.remove.mockResolvedValue(entity);

      const result = await service.remove(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(repo.remove).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });
  });
});
