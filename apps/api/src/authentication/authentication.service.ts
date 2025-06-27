import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  EmailDto,
  LoginDto,
  PasswordDto,
  SignUpDto,
} from '@caniparadis/dtos/dist/authDto';
import { CreateUserDto, Role } from '@caniparadis/dtos/dist/userDTO';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Redis from 'ioredis';

import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { PasswordUtilsService } from '../utils/password-utils.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRedis() private redisService: Redis,
    private emailService: EmailService,
    private passwordUtilsService: PasswordUtilsService,
  ) {}

  async login(login: LoginDto): Promise<string> {
    const userDb = await this.userService.findByEmail(login.email);
    if (!userDb) {
      throw new UnauthorizedException();
    }

    if (!(login.password && userDb?.password)) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(login.password, userDb.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    await this.userService.clearResetPasswordToken(+userDb.id);
    if (userDb.resetPasswordToken) {
      await this.invalidateToken(userDb.resetPasswordToken);
    }

    const payload = { id: userDb.id, email: userDb.email, role: userDb.role };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async signup(login: SignUpDto): Promise<boolean> {
    await this.userService.create(plainToInstance(CreateUserDto, login));
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
    if (decodedToken.role === Role.RESET_TOKEN) {
      return true;
    }

    const userDb = await this.userService.findById(decodedToken.id);

    return (
      decodedToken.id === userDb.id &&
      decodedToken.email === userDb.email &&
      decodedToken.role === userDb.role
    );
  }

  async forgotPassword(email: EmailDto) {
    const user = await this.userService.findByEmail(email.email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email.email}`);
    }

    const emailValue = email.email;
    const payload = { email: emailValue, role: Role.RESET_TOKEN };

    const resetPasswordToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    user.resetPasswordToken = resetPasswordToken;
    user.password = undefined; // Useful to not update password, see check in userService.update()

    await this.emailService.sendResetPasswordEmail(
      emailValue,
      resetPasswordToken,
    );

    await this.userService.update(user.id, user);

    return {
      value: true,
    };
  }

  async updateUserByResetToken(token: string, password: PasswordDto) {
    this.passwordUtilsService.passwordFormatValidation(password.password);

    const user = await this.userService.findByToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid reset token.');
    }

    user.password = password.password;
    user.resetPasswordToken = null;

    await this.userService.update(user.id, user);

    return this.invalidateToken(token);
  }
}
