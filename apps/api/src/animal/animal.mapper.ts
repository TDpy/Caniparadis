import { type AnimalDto } from '@caniparadis/dtos/dist/animalDto';

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
      ownerId: animal.owner.id,
    };
  },

  toDtos(animals: AnimalEntity[]): AnimalDto[] {
    return animals.map((animal) => this.toDto(animal));
  },
};
