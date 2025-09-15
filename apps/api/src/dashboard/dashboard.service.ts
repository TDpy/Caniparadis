import { Injectable } from '@nestjs/common';

import { ReservationService } from '../reservation/reservation.service';
import { AdminStatsDto, ClientStatsDto } from './dashboardStats.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly reservationService: ReservationService) {}

  generateAdminStats(): Promise<AdminStatsDto> {
    return this.reservationService.getAdminDashboardStats();
  }

  generateClientStats(userId: number): Promise<ClientStatsDto> {
    return this.reservationService.getClientDashboardStats(userId);
  }
}
