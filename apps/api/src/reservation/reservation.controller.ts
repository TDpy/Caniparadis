import { SharedReservationDto } from '@caniparadis/dtos/dist/reservationDto'; // DTO internes
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import {CheckAdminGuard} from "../guard/admin.guard";
import {
  CreateReservationDto,
  ProposeNewSlotDto,
  ReservationDto, SearchReservationDto,
  UpdatePaymentDto,
  UpdateReservationDto,
} from './reservation.dto';
import { ReservationMapper } from './reservation.mapper';
import { ReservationService } from './reservation.service';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateReservationDto })
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<SharedReservationDto> {
    const data = await this.reservationService.create({
      ...createReservationDto,
    });
    return ReservationMapper.toDto(data);
  }

  @Get()
  @UseGuards(CheckAdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: [ReservationDto],
  })
  async findAll(  @Query() criteria: SearchReservationDto,
  ): Promise<SharedReservationDto[]> {
    const data = await this.reservationService.findAll(criteria);
    return ReservationMapper.toDtos(data);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async findOne(@Param('id') id: string): Promise<SharedReservationDto> {
    const data = await this.reservationService.findOne(+id);
    return ReservationMapper.toDto(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateReservationDto })
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<SharedReservationDto> {
    const data = await this.reservationService.update(+id, {
      ...updateReservationDto,
    });
    return ReservationMapper.toDto(data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async remove(@Param('id') id: string): Promise<SharedReservationDto> {
    const data = await this.reservationService.remove(+id);
    return ReservationMapper.toDto(data);
  }

  @Post(':id/accept')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async accept(@Param('id') id: string): Promise<SharedReservationDto> {
    const data = await this.reservationService.accept(+id);
    return ReservationMapper.toDto(data);
  }

  @Post(':id/propose')
  @ApiBearerAuth()
  @ApiBody({ type: ProposeNewSlotDto })
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async proposeNewSlot(
    @Param('id') id: string,
    @Body() proposeNewSlotDto: ProposeNewSlotDto,
  ): Promise<SharedReservationDto> {
    const data = await this.reservationService.proposeNewSlot(+id, {
      ...proposeNewSlotDto,
    });
    return ReservationMapper.toDto(data);
  }

  @Post(':id/cancel')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async cancel(@Param('id') id: string): Promise<SharedReservationDto> {
    const data = await this.reservationService.cancel(+id);
    return ReservationMapper.toDto(data);
  }

  @Post(':id/payment')
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePaymentDto })
  @ApiCreatedResponse({
    type: ReservationDto,
  })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<SharedReservationDto> {
    const data = await this.reservationService.updatePayment(+id, {
      ...updatePaymentDto,
    });
    return ReservationMapper.toDto(data);
  }
}
