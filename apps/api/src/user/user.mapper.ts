// src/user/user.mapper.ts

import { type UserDto } from '@caniparadis/dtos/dist/userDTO';

import { type User } from './entities/user';

export const UserMapper = {
  toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },

  toDtos(users: User[]): UserDto[] {
    return users.map(UserMapper.toDto);
  },
};
