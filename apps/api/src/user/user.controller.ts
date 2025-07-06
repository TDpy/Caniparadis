import {
  CreateUserDto,
  UpdateUserDto,
} from '@caniparadis/dtos/dist/userDTO';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CheckUserParamId } from '../decorators/userId.decorator';
import { CheckUserParamIdGuard } from '../guard/userId.guard';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const input: CreateUserInput = {
      email: dto.email,
      password: dto.password,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
    };

    const data = await this.userService.create(input);
    return {
      success: true,
      data: UserMapper.toDto(data),
      message: 'User Created Successfully',
    };
  }

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return {
      success: true,
      data: UserMapper.toDtos(data),
      message: 'User Fetched Successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findById(+id);
    return {
      success: true,
      data: UserMapper.toDto(data),
      message: 'User Fetched Successfully',
    };
  }

  @Patch(':id')
  @UseGuards(CheckUserParamIdGuard)
  @CheckUserParamId('id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const input: UpdateUserInput = {
      ...dto,
    };

    if (req['user']?.role !== 'ADMIN') {
      delete input.role;
    }

    const data = await this.userService.update(+id, input);
    return {
      success: true,
      data: UserMapper.toDto(data),
      message: 'User Updated Successfully',
    };
  }

  @Delete(':id')
  @UseGuards(CheckUserParamIdGuard)
  @CheckUserParamId('id')
  async remove(@Param('id') id: string) {
    const data = await this.userService.remove(+id);
    return {
      success: true,
      data: UserMapper.toDto(data),
      message: 'User Deleted Successfully',
    };
  }
}
