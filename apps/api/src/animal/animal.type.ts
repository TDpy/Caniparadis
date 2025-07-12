import { type AnimalSex } from '@caniparadis/dtos/dist/animalDto';

export interface CreateAnimalInput {
  breed: string;
  isSterilized: boolean;
  name: string;
  ownerId: number;
  sex: AnimalSex;
  type: string;
}

export interface UpdateAnimalInput {
  breed?: string;
  isSterilized?: boolean;
  name?: string;
  ownerId?: number;
  sex?: AnimalSex;
  type?: string;
}
