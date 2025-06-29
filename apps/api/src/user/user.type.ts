import { type Role } from '@caniparadis/dtos/dist/userDTO';

export interface CreateUserInput {
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  role?: Role;
}
