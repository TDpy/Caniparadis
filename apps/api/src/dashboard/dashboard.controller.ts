import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { CheckAdminGuard } from '../guard/admin.guard';
import { DashboardService } from './dashboard.service';
import { AdminStatsDto } from './dashboardStats.dto';

@Controller('dashboard-stats')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(CheckAdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: AdminStatsDto,
  })
  async findAll(): Promise<AdminStatsDto> {
    return this.dashboardService.generateStats();
  }
}
