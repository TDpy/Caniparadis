import { type AnimalDto } from '@caniparadis/dtos/dist/animalDto';

import { UserMapper } from '../user/user.mapper';
import { type AnimalEntity } from './animal.entity';

export const AnimalMapper = {
  toDto(animal: AnimalEntity): AnimalDto {
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

  toDtos(animals: AnimalEntity[]): AnimalDto[] {
    return animals.map((animal) => this.toDto(animal));
  },
};
