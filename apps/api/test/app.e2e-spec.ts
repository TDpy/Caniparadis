// eslint-disable-next-line @typescript-eslint/naming-convention
import type Redis from 'ioredis';

import { type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { EmailService } from '../src/email/email.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let redis: Redis;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({ send: jest.fn() }) // mock simple
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json; charset=utf-8')
      // eslint-disable-next-line sonarjs/no-hardcoded-credentials
      .send({ email: 'test@e2e.com', password: "Test1234" });

    token = loginRes.body.token;
    redis = app.get<Redis>(getRedisConnectionToken());
  });

  afterAll(async () => {
    await app.close();
    await redis.quit();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Hello World!');
  });
});
