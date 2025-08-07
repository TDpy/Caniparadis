import {
  PaymentStatus,
  SharedReservationDto,
} from '@caniparadis/dtos/dist/reservationDto'; // DTO internes
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CheckUserParamId } from '../decorators/userId.decorator';
import { CheckAdminGuard } from '../guard/admin.guard';
import { CheckUserParamIdGuard } from '../guard/userId.guard';
import {
  CreateReservationDto,
  ProposeNewSlotDto,
  ReservationDto,
  SearchReservationDto,
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
    @Req() req: Request,
  ): Promise<SharedReservationDto> {
    const data = await this.reservationService.create(
      {
        ...createReservationDto,
      },
      req['user'],
    );
    return ReservationMapper.toDto(data);
  }

  @Get()
  @UseGuards(CheckUserParamIdGuard)
  @CheckUserParamId('userId')
  @ApiBearerAuth()
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus })
  @ApiCreatedResponse({
    type: [ReservationDto],
  })
  async findAll(
    @Query() criteria: SearchReservationDto,
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
  async accept(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<SharedReservationDto> {
    const data = await this.reservationService.accept(+id, req['user']);
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
    @Req() req: Request,
  ): Promise<SharedReservationDto> {
    const data = await this.reservationService.proposeNewSlot(
      +id,
      {
        ...proposeNewSlotDto,
      },
      req['user'],
    );
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
  @UseGuards(CheckAdminGuard)
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
