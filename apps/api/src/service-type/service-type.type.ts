export class CreateServiceType {
  name: string;
  description: string;
  price: number;
}

export class UpdateServiceType {
  name?: string;
  description?: string;
  price?: number;
}
