
import {SharedUserDto} from "@caniparadis/dtos/dist/userDto";

import { AnimalMapper } from '../animal/animal.mapper';
import { type UserEntity } from './userEntity';

export const UserMapper = {
  toDto(user: UserEntity): SharedUserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      animals: AnimalMapper.toDtos(user.animals),
    };
  },

  toDtos(users: UserEntity[]): SharedUserDto[] {
    return users.map(UserMapper.toDto);
  },
};
