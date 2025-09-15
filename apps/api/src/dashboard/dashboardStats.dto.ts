import { SharedAdminStatsDto } from '@caniparadis/dtos/dist/dashboardStatsDto';
import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsDto implements SharedAdminStatsDto {
  @ApiProperty({ example: 1 })
  pendingReservations: number;

  @ApiProperty({ example: 1 })
  passedReservationsNotPaid: number;

  @ApiProperty({ example: 1 })
  futureReservationsNotPaid: number;
}
