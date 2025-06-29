import { Role } from '@caniparadis/dtos/dist/userDTO';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Redis from 'ioredis';

import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { passwordFormatValidation } from '../utils/password-utils.service';
import {
  EmailInput,
  LoginInput,
  PasswordInput,
  SignUpInput,
} from './authentication.type';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRedis() private redisService: Redis,
    private emailService: EmailService,
  ) {}

  async login(input: LoginInput): Promise<string> {
    const userDb = await this.userService.findByEmail(input.email);
    if (!userDb || !input.password || !userDb.password) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(input.password, userDb.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    await this.userService.clearResetPasswordToken(userDb.id);
    if (userDb.resetPasswordToken) {
      await this.invalidateToken(userDb.resetPasswordToken);
    }

    const payload = {
      id: userDb.id,
      email: userDb.email,
      role: userDb.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async signup(input: SignUpInput): Promise<boolean> {
    await this.userService.create({
      email: input.email,
      password: input.password,
      role: Role.USER,
    });
    return true;
  }

  async invalidateToken(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token);
    const tokenExpiry = decoded.exp * 1000;
    const currentTime = Date.now();
    const ttl = tokenExpiry - currentTime;

    if (ttl > 0) {
      await this.redisService.set(token, 'blacklisted', 'PX', ttl);
    }
  }

  async isJwtTokenUpToDate(token: string): Promise<boolean> {
    const decodedToken = this.jwtService.decode(token);
    if (decodedToken.role === Role.RESET_TOKEN) return true;

    const userDb = await this.userService.findById(decodedToken.id);
    return (
      decodedToken.id === userDb.id &&
      decodedToken.email === userDb.email &&
      decodedToken.role === userDb.role
    );
  }

  async forgotPassword(input: EmailInput) {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${input.email}`);
    }

    const payload = { email: input.email, role: Role.RESET_TOKEN };
    const resetPasswordToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    user.resetPasswordToken = resetPasswordToken;
    user.password = undefined;

    await this.emailService.sendResetPasswordEmail(
      input.email,
      resetPasswordToken,
    );
    await this.userService.update(user.id, user);

    return { value: true };
  }

  async updateUserByResetToken(token: string, input: PasswordInput) {
    passwordFormatValidation(input.password);

    const user = await this.userService.findByToken(token);
    if (!user) throw new UnauthorizedException('Invalid reset token.');

    user.password = input.password;
    user.resetPasswordToken = null;

    await this.userService.update(user.id, user);
    return this.invalidateToken(token);
  }
}
