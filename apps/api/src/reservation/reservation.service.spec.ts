import {
  PaymentStatus,
  ReservationStatus,
} from '@caniparadis/dtos/dist/reservationDto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import { ServiceTypeEntity } from '../service-type/service-type.entity';
import { ReservationEntity } from './reservation.entity';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;

  const mockReservationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const mockAnimalRepository = {
    findOne: jest.fn(),
  };
  const mockServiceTypeRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(AnimalEntity),
          useValue: mockAnimalRepository,
        },
        {
          provide: getRepositoryToken(ServiceTypeEntity),
          useValue: mockServiceTypeRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw NotFoundException if animal not found', async () => {
      mockAnimalRepository.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          animalId: 1,
          serviceTypeId: 2,
          startDate: '2025-01-01',
          endDate: '2025-01-02',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(mockAnimalRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if serviceType not found', async () => {
      mockAnimalRepository.findOne.mockResolvedValue({ id: 1 });
      mockServiceTypeRepository.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          animalId: 1,
          serviceTypeId: 2,
          startDate: '2025-01-01',
          endDate: '2025-01-02',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(mockServiceTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
      });
    });

    it('should create and save reservation', async () => {
      const animal = { id: 1 };
      const serviceType = { id: 2 };
      const createReservation = {
        animalId: 1,
        serviceTypeId: 2,
        startDate: '2025-01-01',
        endDate: '2025-01-02',
      };
      mockAnimalRepository.findOne.mockResolvedValue(animal);
      mockServiceTypeRepository.findOne.mockResolvedValue(serviceType);
      mockReservationRepository.create.mockReturnValue({
        ...createReservation,
        animal,
        serviceType,
      });
      mockReservationRepository.save.mockResolvedValue({
        id: 10,
        ...createReservation,
        animal,
        serviceType,
      });

      const result = await service.create(createReservation);
      expect(mockReservationRepository.create).toHaveBeenCalledWith({
        ...createReservation,
        animal,
        serviceType,
      });
      expect(mockReservationRepository.save).toHaveBeenCalled();
      expect(result.id).toEqual(10);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return reservation if found', async () => {
      const reservation = { id: 1 };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      const result = await service.findOne(1);
      expect(result).toBe(reservation);
    });
  });

  describe('accept', () => {
    it('should accept pending reservation', async () => {
      const reservation = {
        id: 1,
        status: ReservationStatus.PENDING,
        save: jest.fn(),
      };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      mockReservationRepository.save.mockImplementation(async (r) => r);

      const result = await service.accept(1);
      expect(result.status).toBe(ReservationStatus.CONFIRMED);
      expect(mockReservationRepository.save).toHaveBeenCalledWith(reservation);
    });

    it('should throw if status not pending or proposed', async () => {
      const reservation = { id: 1, status: ReservationStatus.CANCELLED };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      await expect(service.accept(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      const reservation = { id: 1, status: ReservationStatus.CONFIRMED };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      mockReservationRepository.save.mockImplementation(async (r) => r);

      const result = await service.cancel(1);
      expect(result.status).toBe(ReservationStatus.CANCELLED);
      expect(mockReservationRepository.save).toHaveBeenCalledWith(reservation);
    });

    it('should throw if already cancelled', async () => {
      const reservation = { id: 1, status: ReservationStatus.CANCELLED };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      await expect(service.cancel(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('proposeNewSlot', () => {
    it('should throw if cancelled', async () => {
      const reservation = { id: 1, status: ReservationStatus.CANCELLED };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      await expect(
        service.proposeNewSlot(
          1,
          {
            startDate: '2025-02-01',
            endDate: '2025-02-02',
            comment: 'New slot',
          },
          {},
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update slot and status', async () => {
      const reservation = {
        id: 1,
        status: ReservationStatus.CONFIRMED,
        save: jest.fn(),
      };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      mockReservationRepository.save.mockImplementation(async (r) => r);

      const dto = {
        startDate: '2025-02-01',
        endDate: '2025-02-02',
        comment: 'New slot',
      };
      const result = await service.proposeNewSlot(1, dto);

      expect(result.status).toBe(ReservationStatus.PROPOSED);
      expect(result.startDate).toEqual(new Date(dto.startDate));
      expect(result.endDate).toEqual(new Date(dto.endDate));
      expect(result.comment).toBe(dto.comment);
      expect(mockReservationRepository.save).toHaveBeenCalledWith(reservation);
    });
  });

  describe('updatePayment', () => {
    it('should update payment status and amountPaid', async () => {
      const reservation = {
        id: 1,
        amountPaid: 10,
        save: jest.fn(),
        paymentStatus: null,
      };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      mockReservationRepository.save.mockImplementation(async (r) => r);

      const dto = { status: PaymentStatus.PAID, amountPaid: 5 };
      const result = await service.updatePayment(1, dto);

      expect(result.paymentStatus).toBe(dto.status);
      expect(result.amountPaid).toBe(15);
      expect(mockReservationRepository.save).toHaveBeenCalledWith(reservation);
    });

    it('should update payment status only if amountPaid undefined', async () => {
      const reservation = {
        id: 1,
        amountPaid: 10,
        save: jest.fn(),
        paymentStatus: null,
      };
      mockReservationRepository.findOne.mockResolvedValue(reservation);
      mockReservationRepository.save.mockImplementation(async (r) => r);

      const dto = { status: PaymentStatus.PAID };
      const result = await service.updatePayment(1, dto);

      expect(result.paymentStatus).toBe(dto.status);
      expect(result.amountPaid).toBe(10);
      expect(mockReservationRepository.save).toHaveBeenCalledWith(reservation);
    });
  });
});
