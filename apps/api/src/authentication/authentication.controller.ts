import {SharedTokenDto} from "@caniparadis/dtos/dist/authDto";
import { SharedUserDto } from '@caniparadis/dtos/dist/userDto';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../decorators/public.decorator';
import { UserDto } from '../user/user.dto';
import { UserMapper } from '../user/user.mapper';
import {
  EmailDto,
  LoginDto,
  PasswordDto,
  SignUpDto,
  TokenDto,
} from './authentication.dto';
import { AuthMapper } from './authentication.mapper';
import { AuthenticationService } from './authentication.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('signup')
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'boolean', example: true },
      },
    },
  })
  signup(@Body() signUpDto: SignUpDto): Promise<{ value: boolean }> {
    return this.authenticationService
      .signup(AuthMapper.toSignUpInput(signUpDto))
      .then((result) => ({ value: result }));
  }

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    type: TokenDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<SharedTokenDto> {
    const token = await this.authenticationService.login(
      AuthMapper.toLoginInput(loginDto),
    );
    return AuthMapper.toTokenDto(token);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Permet l\'invalidation du token JWT',
  })
  logout(@Req() req: Request) {
    return this.authenticationService.invalidateToken(req['token']);
  }

  @Public()
  @Post('forgot-password')
  @ApiBody({ type: EmailDto })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'boolean', example: true },
      },
    },
  })
  forgotPassword(
    @Body() forgotPasswordDto: EmailDto,
  ): Promise<{ value: boolean }> {
    return this.authenticationService.forgotPassword(
      AuthMapper.toEmailInput(forgotPasswordDto),
    );
  }

  @Post('update-password')
  @ApiBearerAuth()
  @ApiBody({ type: PasswordDto })
  updatePassword(@Body() passwordDto: PasswordDto, @Req() req: Request) {
    return this.authenticationService.updateUserByResetToken(
      req['token'],
      AuthMapper.toPasswordInput(passwordDto),
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: UserDto,
  })
  async getCurrentUser(@Req() req: Request): Promise<SharedUserDto> {
    const user = await this.authenticationService.getCurrentUser(req['token']);
    return UserMapper.toDto(user);
  }
}
