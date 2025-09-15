import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

import {DailySchedule} from '../../../components/daily-schedule/daily-schedule';
import {DashboardCardStyle, StatCard} from '../../../components/stat-card/stat-card';

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
  protected readonly DashboardCardStyle = DashboardCardStyle;
  private router = inject(Router);

  public redirectToReservationWaitingForCompany(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.router.navigate(['/reservation'], {
      queryParams: {
        fromDate: this.formatDateForInputLocal(today),
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
        toDate: this.formatDateForInputLocal(yesterday),
        paymentStatus: 'PENDING'
      }
    });
  }

  public redirectToFutureReservationNotPaid(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.router.navigate(['/reservation'], {
      queryParams: {
        fromDate: this.formatDateForInputLocal(today),
        paymentStatus: 'PENDING'
      }
    });
  }

  private formatDateForInputLocal(date: Date): string {
    const pad = (n: number): string => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
