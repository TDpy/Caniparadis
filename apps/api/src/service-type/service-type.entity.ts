import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('service-type')
export class ServiceTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
