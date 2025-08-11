import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { passwordFormatValidation } from '../utils/password-utils.service';
import { sanitizeUserRole } from '../utils/user-utils.service';
import { CreateUserInput, UpdateUserInput } from './user.type';
import { UserEntity } from './userEntity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(input: CreateUserInput): Promise<UserEntity> {
    passwordFormatValidation(input.password);

    input.password = await bcrypt.hash(
      input.password,
      +process.env.BCRYPT_PASSWORD_SALT,
    );

    input.role = sanitizeUserRole(input.role);

    const userData = this.userRepository.create(input);
    return this.userRepository.save(userData);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: ['animals'],
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['animals'],
    });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByToken(token: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async clearResetPasswordToken(userId: number) {
    const user = await this.findById(userId);
    user.resetPasswordToken = null;
    await this.userRepository.save(user);
  }

  async update(id: number, input: UpdateUserInput): Promise<UserEntity> {
    if (input.password) {
      passwordFormatValidation(input.password);
      input.password = await bcrypt.hash(
        input.password,
        +process.env.BCRYPT_PASSWORD_SALT,
      );
    }

    const existingUser = await this.findById(id);
    const merged = this.userRepository.merge(existingUser, input);
    return this.userRepository.save(merged);
  }

  async remove(id: number): Promise<UserEntity> {
    const user = await this.findById(id);
    return this.userRepository.remove(user);
  }
}
