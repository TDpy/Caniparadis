import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/entities/user';

export enum AnimalSex {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
}

@Entity('animal')
export class AnimalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  breed: string;

  @Column({
    type: 'enum',
    enum: AnimalSex,
  })
  sex: AnimalSex;

  @Column({ default: false })
  isSterilized: boolean;

  @ManyToOne(() => User, (user) => user.animals, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  owner: User;
}
