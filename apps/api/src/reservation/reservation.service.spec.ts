import {
  PaymentStatus,
  ReservationStatus,
} from '@caniparadis/dtos/dist/reservationDto';
import { Role } from '@caniparadis/dtos/dist/userDto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AnimalEntity } from '../animal/animal.entity';
import {EmailService} from "../email/email.service";
import { ServiceTypeEntity } from '../service-type/service-type.entity';
import {UserService} from "../user/user.service";
import { UserEntity } from '../user/userEntity';
import {DateUtilsService} from "../utils/date-utils.service";
import { ReservationEntity } from './reservation.entity';
import { ReservationService } from './reservation.service';
import { CreateReservation } from './reservation.type';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  })),
  count: jest.fn(),
});

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepo: ReturnType<typeof mockRepository>;
  let animalRepo: ReturnType<typeof mockRepository>;
  let serviceTypeRepo: ReturnType<typeof mockRepository>;

  const mockUser = (overrides: Partial<UserEntity> = {}): UserEntity => ({
    id: 1,
    email: 'user@test.com',
    // eslint-disable-next-line sonarjs/no-hardcoded-credentials
    password: 'hashed',
    role: Role.USER,
    resetPasswordToken: null,
    firstName: 'Test',
    lastName: 'User',
    animals: [],
    ...overrides,
  });

  const mockEmailService = () => ({
    sendReservationCreationToClientEmail: jest.fn(),
    sendReservationRequestToAdminsEmail: jest.fn(),
    sendReservationProposedSlotEmail: jest.fn(),
    sendReservationAcceptedEmail: jest.fn(),
    sendReservationPaidEmail: jest.fn(),
    sendReservationCancelledEmail: jest.fn(),
    sendReservationRefundedEmail: jest.fn(),
  });

  const mockDateUtilsService = () => ({
    formatDateForEmail: jest.fn().mockImplementation((date) => date.toISOString()),
  });

  const mockUserService = () => ({
    findAdmins: jest.fn().mockResolvedValue([]),
  });


  beforeEach(async () => {
      reservationRepo = mockRepository();
      animalRepo = mockRepository();
      serviceTypeRepo = mockRepository();

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReservationService,
          {
            provide: getRepositoryToken(ReservationEntity),
            useValue: reservationRepo,
          },
          { provide: getRepositoryToken(AnimalEntity), useValue: animalRepo },
          {
            provide: getRepositoryToken(ServiceTypeEntity),
            useValue: serviceTypeRepo,
          },
          { provide: EmailService, useValue: mockEmailService() },
          { provide: DateUtilsService, useValue: mockDateUtilsService() },
          { provide: UserService, useValue: mockUserService() },
        ],
      }).compile();

      service = module.get(ReservationService);
    });


  describe('create', () => {
    it('should throw if animal not found', async () => {
      animalRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.create(
          {
            animalId: 1,
            serviceTypeId: 1,
            startDate: '2025-08-01T10:00:00Z',
            endDate: '2025-08-01T12:00:00Z',
          },
          mockUser(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if service type not found', async () => {
      animalRepo.findOne!.mockResolvedValue({ id: 1 });
      serviceTypeRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.create(
          {
            animalId: 1,
            serviceTypeId: 2,
            startDate: '2025-08-01T10:00:00Z',
            endDate: '2025-08-01T12:00:00Z',
          },
          mockUser(),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create a reservation with correct status based on user role', async () => {
      const animal = { id: 1,   owner: {
          email: 'client@test.com',
          firstName: 'Client',
          lastName: 'Test',
        }
      };
      const serviceType = { id: 2, price: 100 };
      const dto: CreateReservation = {
        animalId: 1,
        serviceTypeId: 2,
        startDate: '2025-08-01T10:00:00Z',
        endDate: '2025-08-01T12:00:00Z',
      };

      animalRepo.findOne!.mockResolvedValue(animal);
      serviceTypeRepo.findOne!.mockResolvedValue(serviceType);
      reservationRepo.create!.mockImplementation((input) => input);
      reservationRepo.save!.mockImplementation(async (input) => ({
        id: 42,
        ...input,
      }));

      const result = await service.create(dto, mockUser({ role: Role.ADMIN }));

      expect(result.status).toBe(ReservationStatus.CONFIRMED);
      expect(result.animal).toBe(animal);
      expect(result.serviceType).toBe(serviceType);
      expect(reservationRepo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw if reservation not found', async () => {
      reservationRepo.findOne!.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should update reservation and save', async () => {
      const reservation = {
        id: 1,
        animal: { id: 1 },
        serviceType: { id: 2 },
        startDate: new Date(),
        endDate: new Date(),
      } as ReservationEntity;

      const updated = {
        animalId: 1,
        serviceTypeId: 2,
        startDate: '2025-08-01T08:00:00Z',
        endDate: '2025-08-01T10:00:00Z',
      };

      reservationRepo.findOne!.mockResolvedValue(reservation);
      reservationRepo.save!.mockImplementation(async (r) => r);

      const result = await service.update(1, updated);
      expect(result.startDate).toBe(updated.startDate);
      expect(result.endDate).toBe(updated.endDate);
      expect(reservationRepo.save).toHaveBeenCalled();
    });
  });

  describe('proposeNewSlot', () => {
    it('should update startDate, endDate and comment', async () => {
      const reservation = {
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
        comment: '',
        animal: {
          owner: {
            email: 'client@test.com',
            firstName: 'Client',
            lastName: 'Test',
          },
        },
        serviceType: {
          name: 'Toilettage',
          price: 100,
        },
      };
      reservationRepo.findOne!.mockResolvedValue(reservation);
      reservationRepo.save!.mockResolvedValue({
        ...reservation,
        comment: 'Updated',
      });

      const result = await service.proposeNewSlot(
        1,
        {
          startDate: '2025-08-02T10:00:00Z',
          endDate: '2025-08-02T12:00:00Z',
          comment: 'Updated',
        },
        mockUser(),
      );

      expect(result.comment).toBe('Updated');
    });
  });

  describe('updatePayment', () => {
    it('should update payment fields', async () => {
      const reservation = {
        id: 1,
        amountPaid: 0,
        paymentStatus: PaymentStatus.PENDING,
        status: ReservationStatus.CONFIRMED,
        serviceType: { price: 100 },
        animal: {
          owner: {
            email: 'client@test.com',
            firstName: 'Client',
            lastName: 'Test',
          },
        },
      };

      reservationRepo.findOne!.mockResolvedValue(reservation);
      reservationRepo.save!.mockImplementation(async (r) => r);

      const result = await service.updatePayment(1, {
        status: PaymentStatus.PAID,
        amountPaid: 100,
      });

      expect(result.amountPaid).toBe(100);
      expect(result.paymentStatus).toBe(PaymentStatus.PAID);
      expect(reservationRepo.save).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove reservation', async () => {
      const reservation = { id: 1 };
      reservationRepo.findOne!.mockResolvedValue(reservation);

      await service.remove(1);
      expect(reservationRepo.remove).toHaveBeenCalledWith(reservation);
    });
  });

  describe('findAll', () => {
    it('should call query builder and return results', async () => {
      const getManyMock = jest.fn().mockResolvedValue([{ id: 1 }]);
      reservationRepo.createQueryBuilder = jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: getManyMock,
      })) as any;

      const result = await service.findAll({});
      expect(result).toEqual([{ id: 1 }]);
      expect(getManyMock).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return reservation', async () => {
      reservationRepo.findOne!.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw if not found', async () => {
      reservationRepo.findOne!.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('should cancel and refund', async () => {
      const reservation = {
        id: 1,
        status: ReservationStatus.CONFIRMED,
        amountPaid: 0,
        paymentStatus: PaymentStatus.PAID,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(reservation as any);
      reservationRepo.save!.mockImplementation(async (r) => r);

      const result = await service.cancel(1);
      expect(result.status).toBe(ReservationStatus.CANCELLED);
      expect(result.paymentStatus).toBe(PaymentStatus.REFUNDED);
    });

    it('should throw if already cancelled', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        status: ReservationStatus.CANCELLED,
      } as any);
      await expect(service.cancel(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('accept', () => {
    it('should throw if not ADMIN and status is PENDING', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        status: ReservationStatus.PENDING,
      } as any);
      await expect(service.accept(1, mockUser())).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if status not acceptable', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        status: ReservationStatus.CANCELLED,
      } as any);
      await expect(
        service.accept(1, mockUser({ role: Role.ADMIN })),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept reservation', async () => {
      const reservation = {
        id: 1,
        status: ReservationStatus.PENDING,
        startDate: new Date(),
        endDate: new Date(),
        comment: '',
        animal: {
          name: 'Rex',
          owner: {
            email: 'client@test.com',
            firstName: 'Client',
            lastName: 'Test',
          },
        },
        serviceType: {
          name: 'Toilettage',
          price: 100,
        },
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(reservation as any);
      reservationRepo.save!.mockImplementation(async (r) => r);
      const result = await service.accept(1, mockUser({ role: Role.ADMIN }));
      expect(result.status).toBe(ReservationStatus.CONFIRMED);
    });
  });

  describe('proposeNewSlot', () => {
    it('should throw if cancelled', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        status: ReservationStatus.CANCELLED,
      } as any);
      await expect(
        service.proposeNewSlot(
          1,
          {
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
          },
          mockUser(),
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should propose as ADMIN', async () => {
      const reservation = {
        id: 1,
        status: ReservationStatus.PENDING,
        startDate: new Date(),
        endDate: new Date(),
        comment: '',
        animal: {
          name: 'Rex',
          owner: {
            email: 'client@test.com',
            firstName: 'Client',
            lastName: 'Test',
          },
        },
        serviceType: {
          name: 'Toilettage',
          price: 100,
        },
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(reservation as any);
      reservationRepo.save!.mockImplementation(async (r) => r);
      const result = await service.proposeNewSlot(
        1,
        {
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        },
        mockUser({ role: Role.ADMIN }),
      );
      expect(result.status).toBe(ReservationStatus.PROPOSED);
    });
  });

  describe('getDashboardStats', () => {
    it('should return counts for today', async () => {
      const today = new Date();
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 0, 0);

      reservationRepo.count = jest.fn().mockImplementation(({ where }) => {
        if (where.status === ReservationStatus.PENDING)
          return Promise.resolve(3);
        if (where.paymentStatus === PaymentStatus.PENDING && where.endDate)
          return Promise.resolve(2);
        if (where.paymentStatus === PaymentStatus.PENDING && where.startDate)
          return Promise.resolve(4);
        return Promise.resolve(0);
      });

      const stats = await service.getAdminDashboardStats();

      expect(stats).toEqual({
        pendingReservations: 3,
        passedReservationsNotPaid: 2,
        futureReservationsNotPaid: 4,
      });

      expect(reservationRepo.count).toHaveBeenCalledTimes(3);
    });
  });

  describe('updateFinalization', () => {
    it('should throw if reservation not found', async () => {
      reservationRepo.findOne!.mockResolvedValue(null);

      await expect(service.updateFinalization(1, true)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update the finalized flag and save', async () => {
      const reservation = { id: 1, finalized: false };
      reservationRepo.findOne!.mockResolvedValue(reservation);
      reservationRepo.save!.mockImplementation(async (r) => r);

      const result = await service.updateFinalization(1, true);

      expect(result.finalized).toBe(true);
      expect(reservationRepo.save).toHaveBeenCalledWith({
        ...reservation,
        finalized: true,
      });
    });

    it('should toggle finalized from true to false', async () => {
      const reservation = { id: 2, finalized: true };
      reservationRepo.findOne!.mockResolvedValue(reservation);
      reservationRepo.save!.mockImplementation(async (r) => r);

      const result = await service.updateFinalization(2, false);

      expect(result.finalized).toBe(false);
      expect(reservationRepo.save).toHaveBeenCalledWith({
        ...reservation,
        finalized: false,
      });
    });
  });
});
