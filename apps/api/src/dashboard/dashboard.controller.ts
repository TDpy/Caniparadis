import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { CheckUserParamId } from '../decorators/userId.decorator';
import { CheckAdminGuard } from '../guard/admin.guard';
import { CheckUserParamIdGuard } from '../guard/userId.guard';
import { DashboardService } from './dashboard.service';
import { AdminStatsDto, ClientStatsDto } from './dashboardStats.dto';

@Controller('dashboard-stats')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(CheckAdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: AdminStatsDto,
  })
  async getAdminStats(): Promise<AdminStatsDto> {
    return this.dashboardService.generateAdminStats();
  }

  @Get('client/:id')
  @UseGuards(CheckUserParamIdGuard)
  @CheckUserParamId('id')
  @ApiBearerAuth()
  @ApiResponse({
    type: ClientStatsDto,
  })
  async getClientStats(@Param('id') id: string): Promise<ClientStatsDto> {
    return this.dashboardService.generateClientStats(+id);
  }
}
