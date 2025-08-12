import { Role } from '@caniparadis/dtos/dist/userDto';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import Redis from 'ioredis';

import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './authentication.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let redisService: jest.Mocked<Redis>;
  let emailService: jest.Mocked<EmailService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    // eslint-disable-next-line sonarjs/no-hardcoded-credentials
    password: 'FakeP4sswordMock',
    role: Role.USER,
    resetPasswordToken: null,
  };

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      clearResetPasswordToken: jest.fn(),
      findById: jest.fn(),
      findByToken: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    jwtService = {
      signAsync: jest.fn(),
      decode: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    redisService = {
      set: jest.fn(),
    } as unknown as jest.Mocked<Redis>;

    emailService = {
      sendSignUpEmail: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;

    service = new AuthenticationService(
      userService,
      jwtService,
      redisService,
      emailService,
    );

    process.env.JWT_SECRET = 'secret';
  });

  describe('login', () => {
    it('should login successfully', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const token = await service.login({
        email: 'test@example.com',
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        password: 'FakeP4sswordMock',
      });

      expect(token).toBe('jwt-token');
      expect(userService.clearResetPasswordToken).toHaveBeenCalledWith(1);
    });

    it('should throw if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        service.login({ email: 'unknown@example.com', password: 'FakeP4ssword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password mismatch', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        service.login({ email: 'test@example.com', password: 'WrongPass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('should create user and send email', async () => {
      userService.create.mockResolvedValue({} as any);

      const result = await service.signup({
        email: 'e@example.com',
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        password: 'p',
        firstName: 'f',
        lastName: 'l',
      });

      expect(result).toBe(true);
      expect(userService.create).toHaveBeenCalled();
      expect(emailService.sendSignUpEmail).toHaveBeenCalled();
    });
  });

  describe('invalidateToken', () => {
    it('should blacklist token if ttl > 0', async () => {
      const exp = Math.floor(Date.now() / 1000) + 60;
      jwtService.decode.mockReturnValue({ exp });

      await service.invalidateToken('token');
      expect(redisService.set).toHaveBeenCalled();
    });

    it('should do nothing if ttl <= 0', async () => {
      jwtService.decode.mockReturnValue({ exp: 0 });

      await service.invalidateToken('token');
      expect(redisService.set).not.toHaveBeenCalled();
    });
  });

  describe('isJwtTokenUpToDate', () => {
    it('should return false if data mismatch', async () => {
      jwtService.decode.mockReturnValue({ id: 1, email: 'x', role: 'r' });
      userService.findById.mockResolvedValue({ id: 2, email: 'y', role: 'r' } as any);

      const result = await service.isJwtTokenUpToDate('t');
      expect(result).toBe(false);
    });
  });

  describe('forgotPassword', () => {
    it('should throw if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(service.forgotPassword({ email: 'e@example.com' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should send email and update user', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      jwtService.signAsync.mockResolvedValue('reset-token');

      const result = await service.forgotPassword({ email: 'e@example.com' });

      expect(result).toEqual({ value: true });
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalled();
      expect(userService.update).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user without password', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: 1 });
      userService.findById.mockResolvedValue({ ...mockUser } as any);

      const result = await service.getCurrentUser('token');

      expect(result.password).toBeUndefined();
    });

    it('should throw if user not found', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: 1 });
      userService.findById.mockResolvedValue(null);

      await expect(service.getCurrentUser('token')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
