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
import {CreateUserDto, UpdateUserDto} from "./user.dto";
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const input: CreateUserInput = {...dto};

    const data = await this.userService.create(input);
    return UserMapper.toDto(data);
  }

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return UserMapper.toDtos(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findById(+id);
    return UserMapper.toDto(data);
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
    return UserMapper.toDto(data);
  }

  @Delete(':id')
  @UseGuards(CheckUserParamIdGuard)
  @CheckUserParamId('id')
  async remove(@Param('id') id: string) {
    const data = await this.userService.remove(+id);
    return UserMapper.toDto(data);
  }
}
