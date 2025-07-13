import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../user/userEntity';

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

  @ManyToOne(() => UserEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;
}
