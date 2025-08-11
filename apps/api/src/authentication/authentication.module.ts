import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@nestjs-modules/ioredis';

import { EmailService } from '../email/email.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 180_000,
          limit: 10,
        },
      ],
    }),    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_PASSWORD
        ? `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, EmailService],
  exports: [RedisModule],
})
export class AuthenticationModule {}
