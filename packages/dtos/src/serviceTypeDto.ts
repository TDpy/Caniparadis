export interface SharedCreateServiceTypeDto {
  name: string;
  description: string;
  price: number;
}

export type SharedUpdateServiceTypeDto = Partial<SharedCreateServiceTypeDto>;

export interface SharedServiceTypeDto {
  id: number;
  name: string;
  description: string;
  price: number;
}
