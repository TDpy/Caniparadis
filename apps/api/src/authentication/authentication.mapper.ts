import {
  type EmailDto,
  type LoginDto,
  type PasswordDto,
  type SignUpDto,
  type TokenDto,
} from '@caniparadis/dtos/dist/authDto';

import {
  type EmailInput,
  type LoginInput,
  type PasswordInput,
  type SignUpInput,
} from './authentication.type';

export const AuthMapper = {
  toLoginInput(dto: LoginDto): LoginInput {
    return {
      email: dto.email,
      password: dto.password,
    };
  },

  toSignUpInput(dto: SignUpDto): SignUpInput {
    return {
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    };
  },

  toPasswordInput(dto: PasswordDto): PasswordInput {
    return {
      password: dto.password,
    };
  },

  toEmailInput(dto: EmailDto): EmailInput {
    return {
      email: dto.email,
    };
  },

  toTokenDto(token: string): TokenDto {
    return {
      token,
    };
  },
};
