import { Injectable } from '@nestjs/common';

import { ReservationService } from '../reservation/reservation.service';
import { AdminStatsDto } from './dashboardStats.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly reservationService: ReservationService) {}

  generateStats(): Promise<AdminStatsDto> {
    return this.reservationService.getDashboardStats();
  }
}
