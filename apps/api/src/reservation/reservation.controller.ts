import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import {CreateReservationDto, ProposeNewSlotDto, UpdatePaymentDto, UpdateReservationDto} from "./reservation.dto";
import { ReservationMapper } from './reservation.mapper';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    const data = await this.reservationService.create({
      ...createReservationDto,
    });
    return ReservationMapper.toDto(data);
  }

  @Get()
  async findAll() {
    const data = await this.reservationService.findAll();
    return ReservationMapper.toDtos(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.reservationService.findOne(+id);
    return ReservationMapper.toDto(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const data = await this.reservationService.update(+id, {
      ...updateReservationDto,
    });
    return ReservationMapper.toDto(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.reservationService.remove(+id);
    return ReservationMapper.toDto(data);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string) {
    const data = await this.reservationService.accept(+id);
    return ReservationMapper.toDto(data);
  }

  @Post(':id/propose')
  async proposeNewSlot(
    @Param('id') id: string,
    @Body() proposeNewSlotDto: ProposeNewSlotDto,
  ) {
    const data = await this.reservationService.proposeNewSlot(+id, {
      ...proposeNewSlotDto,
    });
    return ReservationMapper.toDto(data);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    const data = await this.reservationService.cancel(+id);
    return ReservationMapper.toDto(data);
  }

  @Post(':id/payment')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    const data = await this.reservationService.updatePayment(+id, {
      ...updatePaymentDto,
    });
    return ReservationMapper.toDto(data);
  }
}
