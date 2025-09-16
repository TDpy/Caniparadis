import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {SharedAdminStatsDto} from '@caniparadis/dtos/dist/dashboardStatsDto';

import {DailySchedule} from '../../../components/daily-schedule/daily-schedule';
import {DashboardCardStyle, StatCard} from '../../../components/stat-card/stat-card';
import {DashboardService} from '../../../services/dashboard.service';
import {formatDateForInputLocal} from '../../../utils/date.utils';

@Component({
  selector: 'app-dashboard-admin',
  imports: [
    StatCard,
    DailySchedule
  ],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.scss'
})
export class DashboardAdmin {
  stats: SharedAdminStatsDto = {
    pendingReservations: 0,
    passedReservationsNotPaid: 0,
    futureReservationsNotPaid: 0
  };
  protected readonly DashboardCardStyle = DashboardCardStyle;
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.getAdminDashboardStats().subscribe({
      next: (adminStats) => this.stats = adminStats
    });
  }

  public redirectToReservationWaitingForCompany(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.router.navigate(['/reservation'], {
      queryParams: {
        fromDate: formatDateForInputLocal(today),
        status: 'PENDING'
      }
    });
  }

  public redirectToPassedReservationNotPaid(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 0, 0);

    this.router.navigate(['/reservation'], {
      queryParams: {
        toDate: formatDateForInputLocal(yesterday),
        paymentStatus: 'PENDING'
      }
    });
  }

  public redirectToFutureReservationNotPaid(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.router.navigate(['/reservation'], {
      queryParams: {
        fromDate: formatDateForInputLocal(today),
        paymentStatus: 'PENDING'
      }
    });
  }
}
