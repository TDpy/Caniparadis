import {
  CreateReservationDto,
  ProposeNewSlotDto,
  UpdatePaymentDto,
  UpdateReservationDto,
} from '@caniparadis/dtos/dist/reservationDto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create({ ...createReservationDto });
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(+id, { ...updateReservationDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string) {
    return this.reservationService.accept(+id);
  }

  @Post(':id/propose')
  proposeNewSlot(
    @Param('id') id: string,
    @Body() proposeNewSlotDto: ProposeNewSlotDto,
  ) {
    return this.reservationService.proposeNewSlot(+id, {
      ...proposeNewSlotDto,
    });
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.reservationService.cancel(+id);
  }

  @Post(':id/payment')
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.reservationService.updatePayment(+id, { ...updatePaymentDto });
  }
}
