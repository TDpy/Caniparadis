import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {SharedClientStatsDto} from '@caniparadis/dtos/dist/dashboardStatsDto';
import {switchMap} from 'rxjs';

import {DashboardCardStyle, StatCard} from '../../../components/stat-card/stat-card';
import {AuthService} from '../../../services/auth.service';
import {DashboardService} from '../../../services/dashboard.service';
import {formatDateForInputLocal} from '../../../utils/date.utils';

@Component({
  selector: 'app-dashboard-client',
  imports: [
    StatCard
  ],
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.scss'
})
export class DashboardClient {
  stats: SharedClientStatsDto = {
    passedReservationsNotPaid: 0,
    futureReservations: 0,
    passedReservations: 0
  };
  protected readonly DashboardCardStyle = DashboardCardStyle;
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(
        switchMap(user => this.dashboardService.getClientDashboardStats(user.id))
      )
      .subscribe({
        next: (clientStats) => this.stats = clientStats
      });
  }

  public redirectToReservationCreation(): void {
    this.router.navigate(['/reservation/create']);
  }

  public redirectToFutureReservation(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.router.navigate(['/reservation'], {
      queryParams: {
        fromDate: formatDateForInputLocal(today),
      },
    });
  }

  public redirectToPassedReservationNotPaid(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.router.navigate(['/reservation'], {
      queryParams: {
        toDate: formatDateForInputLocal(today),
        paymentStatus: 'PENDING',
      },
    });
  }

}
