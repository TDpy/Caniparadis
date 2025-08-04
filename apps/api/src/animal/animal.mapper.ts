
import {SharedAnimalDto} from "@caniparadis/dtos/dist/animalDto";

import { UserMapper } from '../user/user.mapper';
import { type AnimalEntity } from './animal.entity';

export const AnimalMapper = {
  toDto(animal: AnimalEntity): SharedAnimalDto {
    return {
      id: animal.id,
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      sex: animal.sex,
      isSterilized: animal.isSterilized,
      owner: UserMapper.toDto(animal.owner),
    };
  },

  toDtos(animals: AnimalEntity[]): SharedAnimalDto[] {
    return animals?.map((animal) => this.toDto(animal));
  },
};
