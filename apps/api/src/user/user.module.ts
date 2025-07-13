import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationService } from '../authentication/authentication.service';
import { EmailService } from '../email/email.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './userEntity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    AuthenticationService,
    EmailService,
  ],
  exports: [UserService],
})
export class UserModule {}
