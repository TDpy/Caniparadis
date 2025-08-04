import { SharedUserDto } from '@caniparadis/dtos/dist/userDto';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CheckUserParamId } from '../decorators/userId.decorator';
import { CheckUserParamIdGuard } from '../guard/userId.guard';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.type';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserDto })
  async create(@Body() dto: CreateUserDto): Promise<SharedUserDto> {
    const input: CreateUserInput = { ...dto };
    const data = await this.userService.create(input);
    return UserMapper.toDto(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: [UserDto] })
  async findAll(): Promise<SharedUserDto[]> {
    const data = await this.userService.findAll();
    return UserMapper.toDtos(data);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserDto })
  async findOne(@Param('id') id: string): Promise<SharedUserDto> {
    const data = await this.userService.findById(+id);
    return UserMapper.toDto(data);
  }

  @Patch(':id')
  @UseGuards(CheckUserParamIdGuard)
  @CheckUserParamId('id')
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserDto })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<SharedUserDto> {
    const input: UpdateUserInput = { ...dto };
    if (req['user']?.role !== 'ADMIN') {
      delete input.role;
    }
    const data = await this.userService.update(+id, input);
    return UserMapper.toDto(data);
  }

  @Delete(':id')
  @UseGuards(CheckUserParamIdGuard)
  @CheckUserParamId('id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserDto })
  async remove(@Param('id') id: string): Promise<SharedUserDto> {
    const data = await this.userService.remove(+id);
    return UserMapper.toDto(data);
  }
}
