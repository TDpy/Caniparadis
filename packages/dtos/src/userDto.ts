import {SharedAnimalDto} from "./animalDto";

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  RESET_TOKEN = 'RESET_TOKEN',
}

export interface SharedUserDto {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  animals?: SharedAnimalDto[];
}

export interface SharedCreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role?: Role;
}

export type SharedUpdateUserDto = Partial<SharedCreateUserDto>;
