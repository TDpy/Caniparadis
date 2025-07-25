import {AnimalDto} from "./animalDto";

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  RESET_TOKEN = 'RESET_TOKEN',
}

export interface UserDto {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  animals?: AnimalDto[];
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role?: Role;
  animals?: AnimalDto[];
}

export type UpdateUserDto = Partial<CreateUserDto>;
