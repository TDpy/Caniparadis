import {UserDto} from "./userDto";

export enum AnimalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface CreateAnimalDto {
  name: string;
  type: string;
  breed: string;
  ownerId: number;
  sex: AnimalSex;
  isSterilized: boolean;
}

export type UpdateAnimalDto = Partial<CreateAnimalDto>;

export interface AnimalDto {
  id: number;
  name: string;
  type: string;
  breed: string;
  sex: AnimalSex;
  isSterilized: boolean;
  owner: UserDto;
}
