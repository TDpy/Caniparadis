import { type ServiceTypeDto } from '@caniparadis/dtos/dist/serviceTypeDto';

import { type ServiceTypeEntity } from './service-type.entity';

export const ServiceTypeMapper = {
  toDto(serviceType: ServiceTypeEntity): ServiceTypeDto {
    return {
      id: serviceType.id,
      name: serviceType.name,
      description: serviceType.description,
    };
  },

  toDtos(serviceTypes: ServiceTypeEntity[]): ServiceTypeDto[] {
    return serviceTypes.map((serviceType) => this.toDto(serviceType));
  },
};
