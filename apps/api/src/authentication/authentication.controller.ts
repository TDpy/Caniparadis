import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  EmailDto,
  LoginDto,
  PasswordDto,
  SignUpDto,
  TokenDto,
} from '@spottobe/dtos/dist/authDto';
import { plainToInstance } from 'class-transformer';

import { Public } from '../decorators/public.decorator';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('signup')
  signup(@Body() signUpDto: SignUpDto): Promise<boolean> {
    return this.authenticationService.signup(signUpDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUser: LoginDto): Promise<TokenDto> {
    return plainToInstance(TokenDto, {token: await this.authenticationService.login(loginUser)});
  }

  @Post('logout')
  logout(@Req() req: Request) {
    return this.authenticationService.invalidateToken(req['token']);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPassword: EmailDto) {
    return this.authenticationService.forgotPassword(forgotPassword);
  }

  @Post('update-password')
  updatePassword(@Body() password: PasswordDto, @Req() req: Request) {
    return this.authenticationService.updateUserByResetToken(
      req['token'],
      password,
    );
  }
}
