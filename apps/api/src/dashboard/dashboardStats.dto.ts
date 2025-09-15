import {
  SharedAdminStatsDto,
  SharedClientStatsDto,
} from '@caniparadis/dtos/dist/dashboardStatsDto';
import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsDto implements SharedAdminStatsDto {
  @ApiProperty({ example: 1 })
  pendingReservations: number;

  @ApiProperty({ example: 1 })
  passedReservationsNotPaid: number;

  @ApiProperty({ example: 1 })
  futureReservationsNotPaid: number;
}

export class ClientStatsDto implements SharedClientStatsDto {
  @ApiProperty({ example: 1 })
  passedReservationsNotPaid: number;

  @ApiProperty({ example: 1 })
  futureReservations: number;

  @ApiProperty({ example: 1 })
  passedReservations: number;
}
