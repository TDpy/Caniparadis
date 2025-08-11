import {type AnimalSex, SharedCreateAnimalDto} from '@caniparadis/dtos/dist/animalDto';

export interface CreateAnimalInput extends SharedCreateAnimalDto{
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
