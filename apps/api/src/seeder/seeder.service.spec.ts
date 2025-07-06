import { Role } from '@caniparadis/dtos/dist/userDTO';
import { Test, type TestingModule } from '@nestjs/testing';

import { UserService } from '../user/user.service';
import { SeederService } from './seeder.service';

describe('SeederService', () => {
  let service: SeederService;
  let userServiceMock: {
    create: jest.Mock;
    findByEmail: jest.Mock;
  };

  beforeEach(async () => {
    userServiceMock = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user if not exists', async () => {
    userServiceMock.findByEmail.mockResolvedValue(undefined);

    await service.run();

    expect(userServiceMock.create).toHaveBeenCalledWith({
      email: 'test@e2e.com',
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      password: 'Test1234',
      firstName: 'firstName',
      lastName: 'lastName',
      role: Role.ADMIN,
    });
  });

  it('should not create user if already exists', async () => {
    userServiceMock.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@e2e.com',
    });

    await service.run();

    expect(userServiceMock.create).not.toHaveBeenCalled();
  });
});
