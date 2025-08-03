import {SharedUserDto} from "./userDto";

export enum AnimalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface SharedCreateAnimalDto {
  name: string;
  type: string;
  breed: string;
  ownerId: number;
  sex: AnimalSex;
  isSterilized: boolean;
}

export type SharedUpdateAnimalDto = Partial<SharedCreateAnimalDto>;

export interface SharedAnimalDto {
  id: number;
  name: string;
  type: string;
  breed: string;
  sex: AnimalSex;
  isSterilized: boolean;
  owner: SharedUserDto;
}
