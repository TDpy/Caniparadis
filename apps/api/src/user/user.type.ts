import { type Role } from '@caniparadis/dtos/dist/userDTO';

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  address?: string;
  phoneNumber?: string;
  role?: Role;
}

export interface UpdateUserInput {
  address?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string;
  role?: Role;
}
