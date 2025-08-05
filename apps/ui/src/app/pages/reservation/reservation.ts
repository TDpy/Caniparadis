import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {SharedReservationDto, SharedSearchReservationCriteriaDto} from '@caniparadis/dtos/dist/reservationDto';
import {Role} from '@caniparadis/dtos/dist/userDto';
import {mergeMap, tap} from 'rxjs';

import {Table, TableColumnDirective} from '../../components/table/table';
import {PaymentTranslatePipe} from '../../pipes/payment-translate.pipe';
import {StatusTranslatePipe} from '../../pipes/status-translate.pipe';
import {AuthService} from '../../services/auth.service';
import {ReservationService} from '../../services/reservation.service';
import {ToasterService} from '../../services/toaster.service';

@Component({
  selector: 'app-reservation',
  imports: [
    Table,
    TableColumnDirective,
    CommonModule,
    RouterModule,
    StatusTranslatePipe,
    PaymentTranslatePipe,
  ],
  templateUrl: './reservation.html',
  standalone: true,
  styleUrl: './reservation.scss'
})
export class Reservation {
  router = inject(Router);
  reservations?: SharedReservationDto[] = [];
  searchCriteria: SharedSearchReservationCriteriaDto = {fromDate: new Date()}
  private reservationService = inject(ReservationService);
  private toasterService = inject(ToasterService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(
      tap((authUser) => {
        console.log(authUser);
        this.searchCriteria = authUser.role === Role.ADMIN ? {
          fromDate: new Date(),
        } : {
          userId: authUser.id,
        };
      }),
      mergeMap(() => {
        return this.reservationService.findAll(this.searchCriteria)
      })
    ).subscribe({
      next: (reservations: SharedReservationDto[]) => {
        this.reservations = reservations;
      },
      error: (_) => {
        this.toasterService.error(`Erreur lors de la récupération des réservations.`)
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/reservation/create']);
  }

}
