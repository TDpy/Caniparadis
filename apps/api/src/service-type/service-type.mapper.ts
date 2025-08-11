
import {SharedServiceTypeDto} from "@caniparadis/dtos/dist/serviceTypeDto";

import { type ServiceTypeEntity } from './service-type.entity';

export const ServiceTypeMapper = {
  toDto(serviceType: ServiceTypeEntity): SharedServiceTypeDto {
    return {
      id: serviceType.id,
      name: serviceType.name,
      description: serviceType.description,
      price: serviceType.price,
    };
  },

  toDtos(serviceTypes: ServiceTypeEntity[]): SharedServiceTypeDto[] {
    return serviceTypes.map((serviceType) => this.toDto(serviceType));
  },
};
