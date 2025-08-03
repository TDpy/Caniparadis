import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { Public } from '../decorators/public.decorator';
import { UserMapper } from '../user/user.mapper';
import {EmailDto, LoginDto, PasswordDto, SignUpDto, TokenDto} from "./authentication.dto";
import { AuthMapper } from './authentication.mapper';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('signup')
  signup(@Body() signUpDto: SignUpDto): Promise<boolean> {
    return this.authenticationService.signup(
      AuthMapper.toSignUpInput(signUpDto),
    );
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    const token = await this.authenticationService.login(
      AuthMapper.toLoginInput(loginDto),
    );
    return AuthMapper.toTokenDto(token);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    return this.authenticationService.invalidateToken(req['token']);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: EmailDto) {
    return this.authenticationService.forgotPassword(
      AuthMapper.toEmailInput(forgotPasswordDto),
    );
  }

  @Post('update-password')
  updatePassword(@Body() passwordDto: PasswordDto, @Req() req: Request) {
    return this.authenticationService.updateUserByResetToken(
      req['token'],
      AuthMapper.toPasswordInput(passwordDto),
    );
  }

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = await this.authenticationService.getCurrentUser(req['token']);
    return UserMapper.toDto(user);
  }
}
