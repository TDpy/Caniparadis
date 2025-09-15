import {formatDate} from '@angular/common';
import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedReservationDto} from '@caniparadis/dtos/dist/reservationDto';

import {PaymentTranslatePipe} from '../../pipes/payment-translate.pipe';
import {ReservationService} from '../../services/reservation.service';
import {Table, TableColumnDirective} from '../table/table';

@Component({
  selector: 'app-daily-schedule',
  imports: [Table, TableColumnDirective, PaymentTranslatePipe, RouterModule,],
  templateUrl: './daily-schedule.html',
  styleUrl: './daily-schedule.scss',
})
export class DailySchedule {

  nurseryReservations!: SharedReservationDto[];
  otherReservations!: SharedReservationDto[];

  public tabMode: 'nursery' | 'other' = 'nursery';
  private reservationService = inject(ReservationService);


  public ngOnInit(): void {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 0, 0);

    this.reservationService.findAll({
      fromDate: todayStart.toISOString(),
      toDate: todayEnd.toISOString(),
    }).subscribe({
      next: (dailyReservations) => {
        this.nurseryReservations = dailyReservations
          .filter(r => r.serviceType.name.toUpperCase() === 'GARDERIE');

        this.otherReservations = dailyReservations
          .filter(r => r.serviceType.name.toUpperCase() !== 'GARDERIE');
      }
    });
  }

  formatHour(date: string): string {
    return formatDate(date, 'HH:mm', 'en-US');
  }
}
