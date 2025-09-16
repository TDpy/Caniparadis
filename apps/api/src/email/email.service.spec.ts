import { Test, type TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get(EmailService);
    mailerService = module.get(MailerService);

    jest.clearAllMocks();
  });

  describe('sendResetPasswordEmail', () => {
    it('should call mailerService.sendMail with correct params', async () => {
      await service.sendResetPasswordEmail('test@example.com', 'token123');
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Réinitialisation du mot de passe',
        template: './reset-password',
        context: {
          url: `${process.env.FRONT_URL}/auth/reset-password/token123`,
        },
      });
    });
  });

  describe('sendSignUpEmail', () => {
    it('should call mailerService.sendMail with correct params', async () => {
      await service.sendSignUpEmail('test@example.com', 'John', 'Doe');
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Bienvenue chez Caniparadis',
        template: './signup-success',
        context: {
          url: `${process.env.FRONT_URL}/auth/login`,
          firstName: 'John',
          lastName: 'Doe',
        },
      });
    });
  });

  describe('sendReservationCreationToClientEmail', () => {
    it('should call mailerService.sendMail with correct params', async () => {
      await service.sendReservationCreationToClientEmail(
        1,
        'client@test.com',
        'Client',
        'Test',
        '2025-08-01T10:00:00Z',
        'Rex',
        'Toilettage',
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'client@test.com',
        subject: 'Votre réservation',
        template: './creation-to-client',
        context: {
          url: `${process.env.FRONT_URL}/reservation/1`,
          firstName: 'Client',
          lastName: 'Test',
          date: '2025-08-01T10:00:00Z',
          animalName: 'Rex',
          serviceType: 'Toilettage',
        },
      });
    });
  });

  describe('sendReservationRequestToAdminsEmail', () => {
    it('should call mailerService.sendMail with correct params', async () => {
      await service.sendReservationRequestToAdminsEmail(
        1,
        'admin@test.com',
        'Admin',
        'User',
        '2025-08-01T10:00:00Z',
        'Rex',
        'Toilettage',
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'admin@test.com',
        subject: 'Demande de réservation',
        template: './request-to-admin',
        context: {
          url: `${process.env.FRONT_URL}/reservation/1`,
          firstName: 'Admin',
          lastName: 'User',
          date: '2025-08-01T10:00:00Z',
          animalName: 'Rex',
          serviceType: 'Toilettage',
        },
      });
    });
  });

  describe('sendReservationAcceptedEmail', () => {
    it('should call mailerService.sendMail with correct params', async () => {
      await service.sendReservationAcceptedEmail(
        1,
        'client@test.com',
        'Client',
        'Test',
        '2025-08-01T10:00:00Z',
        'Rex',
        'Toilettage',
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'client@test.com',
        subject: 'Réservation confirmée',
        template: './accepted',
        context: {
          url: `${process.env.FRONT_URL}/reservation/1`,
          firstName: 'Client',
          lastName: 'Test',
          date: '2025-08-01T10:00:00Z',
          animalName: 'Rex',
          serviceType: 'Toilettage',
        },
      });
    });
  });

  describe('sendReservationProposedSlotEmail', () => {
    it('should call mailerService.sendMail with comment', async () => {
      await service.sendReservationProposedSlotEmail(
        1,
        'client@test.com',
        'Client',
        'Test',
        '2025-08-01T10:00:00Z',
        'Rex',
        'Toilettage',
        'Nouvelle proposition',
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'client@test.com',
        subject: 'Nouvelle proposition de créneau',
        template: './proposed-slot',
        context: {
          url: `${process.env.FRONT_URL}/reservation/1`,
          firstName: 'Client',
          lastName: 'Test',
          date: '2025-08-01T10:00:00Z',
          animalName: 'Rex',
          serviceType: 'Toilettage',
          comment: 'Nouvelle proposition',
        },
      });
    });
  });

  describe('sendReservationPaidEmail', () => {
    it('should call mailerService.sendMail with correct params', async () => {
      await service.sendReservationPaidEmail(
        1,
        'client@test.com',
        'Client',
        'Test',
        100,
        100,
        'Rex',
        'Toilettage',
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'client@test.com',
        subject: 'Paiement confirmé',
        template: './paid',
        context: {
          url: `${process.env.FRONT_URL}/reservation/1`,
          firstName: 'Client',
          lastName: 'Test',
          amountPaid: 100,
          totalPrice: 100,
          animalName: 'Rex',
          serviceType: 'Toilettage',
        },
      });
    });
  });
});
