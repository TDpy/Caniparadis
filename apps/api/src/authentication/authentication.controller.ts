// src/auth/authentication.controller.ts

import {
  EmailDto,
  LoginDto,
  PasswordDto,
  SignUpDto,
  TokenDto,
} from '@caniparadis/dtos/dist/authDto';
import { Body, Controller, Post, Req } from '@nestjs/common';

import { Public } from '../decorators/public.decorator';
import { AuthMapper } from './authentication.mapper';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('signup')
  signup(@Body() signUpDto: SignUpDto): Promise<boolean> {
    return this.authenticationService.signup(AuthMapper.toSignUpInput(signUpDto));
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    const token = await this.authenticationService.login(AuthMapper.toLoginInput(loginDto));
    return AuthMapper.toTokenDto(token);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    return this.authenticationService.invalidateToken(req['token']);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: EmailDto) {
    return this.authenticationService.forgotPassword(AuthMapper.toEmailInput(forgotPasswordDto));
  }

  @Post('update-password')
  updatePassword(@Body() passwordDto: PasswordDto, @Req() req: Request) {
    return this.authenticationService.updateUserByResetToken(
      req['token'],
      AuthMapper.toPasswordInput(passwordDto),
    );
  }
}
