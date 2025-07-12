import { Role } from '@caniparadis/dtos/dist/userDTO';
import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { type Repository } from 'typeorm';

import { User } from './entities/user';
import { UserService } from './user.service';
import { type CreateUserInput, type UpdateUserInput } from './user.type';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  const userArray: User[] = [
    {
      id: 1,
      email: 'john@example.com',
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      password: 'hashed',
      role: Role.USER,
      resetPasswordToken: null,
      firstName: 'First',
      lastName: 'LAST',
      animals: [],
    },
    {
      id: 2,
      email: 'jane@example.com',
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      password: 'hashed2',
      role: Role.ADMIN,
      resetPasswordToken: null,
      firstName: 'First',
      lastName: 'LAST',
      animals: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
    process.env.BCRYPT_PASSWORD_SALT = '10';
  });

  describe('create', () => {
    it('should hash password and save user', async () => {
      const input: CreateUserInput = {
        email: 'new@example.com',
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        password: 'Secure1!',
        firstName: 'First',
        lastName: 'LAST',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPw');
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      repo.create.mockReturnValue(mockUser({ ...input, password: 'hashedPw' }));
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      repo.save.mockResolvedValue(mockUser({ ...input, password: 'hashedPw' }));

      const result = await service.create(input);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalled();
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashedPw' }));
      expect(result.email).toEqual(input.email);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repo.find.mockResolvedValue(userArray);

      const result = await service.findAll();

      expect(result).toEqual(userArray);
      expect(repo.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      repo.findOne.mockResolvedValue(userArray[0]);

      const result = await service.findById(1);

      expect(result).toEqual(userArray[0]);
    });

    it('should throw if user not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash password if present and merge user', async () => {
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      const input: UpdateUserInput = { password: 'NewSecure1!' };
      const existingUser = userArray[0];

      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPw');
      repo.findOne.mockResolvedValue(existingUser);
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      repo.merge.mockReturnValue({ ...existingUser, password: 'newHashedPw' });
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      repo.save.mockResolvedValue({ ...existingUser, password: 'newHashedPw' });

      const result = await service.update(1, input);

      expect(result.password).toBe('newHashedPw');
    });
  });

  describe('remove', () => {
    it('should remove user if exists', async () => {
      repo.findOne.mockResolvedValue(userArray[0]);
      repo.remove.mockResolvedValue(userArray[0]);

      const result = await service.remove(1);

      expect(result).toEqual(userArray[0]);
    });
  });

  describe('clearResetPasswordToken', () => {
    it('should nullify reset token', async () => {
      const user = { ...userArray[0], resetPasswordToken: 'some-token' };
      repo.findOne.mockResolvedValue(user);
      repo.save.mockResolvedValue({ ...user, resetPasswordToken: null });

      await service.clearResetPasswordToken(1);

      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ resetPasswordToken: null }));
    });
  });

  describe('findByToken', () => {
    it('should return user if token matches', async () => {
      const userWithToken = {
        ...userArray[0],
        resetPasswordToken: 'reset-token-123',
      };
      repo.findOne.mockResolvedValue(userWithToken);

      const result = await service.findByToken('reset-token-123');

      expect(result).toEqual(userWithToken);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { resetPasswordToken: 'reset-token-123' },
      });
    });

    it('should throw if no user matches token', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findByToken('invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const email = 'john@example.com';
      const expectedUser = userArray[0];

      repo.findOne.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('should return null if user not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('unknown@example.com');

      expect(result).toBeNull();
    });
  });

});

/**
 * create basic user for mock functions
 */
function mockUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'test@example.com',
    // eslint-disable-next-line sonarjs/no-hardcoded-credentials
    password: 'hashedPassword',
    role: Role.USER,
    resetPasswordToken: null,
    firstName: 'First',
    lastName: 'LAST',
    animals: [],
    ...overrides,
  };
}
