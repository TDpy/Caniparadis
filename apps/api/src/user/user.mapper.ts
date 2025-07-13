import { type UserDto } from '@caniparadis/dtos/dist/userDto';

import { type UserEntity } from './userEntity';

export const UserMapper = {
  toDto(user: UserEntity): UserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    };
  },

  toDtos(users: UserEntity[]): UserDto[] {
    return users.map(UserMapper.toDto);
  },
};
