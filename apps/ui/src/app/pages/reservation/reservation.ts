import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {
  PaymentStatus,
  SharedReservationDto,
  SharedSearchReservationCriteriaDto
} from '@caniparadis/dtos/dist/reservationDto';
import {Role} from '@caniparadis/dtos/dist/userDto';
import {NgSelectModule} from '@ng-select/ng-select';
import {map, mergeMap, tap} from 'rxjs';

import {Table, TableColumnDirective} from '../../components/table/table';
import {PaymentTranslatePipe} from '../../pipes/payment-translate.pipe';
import {StatusTranslatePipe} from '../../pipes/status-translate.pipe';
import {AuthService} from '../../services/auth.service';
import {ReservationService} from '../../services/reservation.service';
import {ToasterService} from '../../services/toaster.service';
import {UserService} from '../../services/user.service';

interface SearchFormModel {
  fromDate?: string;
  paymentStatus?: PaymentStatus;
  toDate?: string;
  userId?: number;
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    Table,
    TableColumnDirective,
    CommonModule,
    RouterModule,
    StatusTranslatePipe,
    PaymentTranslatePipe,
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './reservation.html',
  styleUrl: './reservation.scss',
})
export class Reservation {
  router = inject(Router);
  reservations?: SharedReservationDto[] = [];

  searchForm: SearchFormModel = {};

  isAdmin = false;
  paymentStatusOptions: { label: string; value: PaymentStatus }[] = [];
  owners: { id: number; email: string; firstName: string; fullName: string; lastName: string }[] = [];
  private reservationService = inject(ReservationService);
  private toasterService = inject(ToasterService);
  private authService = inject(AuthService);
  private paymentTranslatePipe = inject(PaymentTranslatePipe);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.paymentStatusOptions = Object.values(PaymentStatus).map(status => ({
      label: this.paymentTranslatePipe.transform(status),
      value: status,
    }));
    this.searchForm.fromDate = this.formatDateForInputLocal(this.getTodayStart());
    this.searchForm.toDate = this.formatDateForInputLocal(this.getTodayEnd());
    this.loadOwners();

    this.authService.getCurrentUser().pipe(
      tap((authUser) => {
        this.isAdmin = authUser.role === Role.ADMIN;

        if (!this.isAdmin) {
          this.searchForm.userId = authUser.id;
        }
      }),
      mergeMap(() => {
        const criteria = this.convertFormToCriteria(this.searchForm);
        return this.reservationService.findAll(criteria);
      })
    ).subscribe({
      next: (reservations: SharedReservationDto[]) => {
        this.reservations = reservations;
      },
      error: (_) => {
        this.toasterService.error(`Erreur lors de la récupération des réservations.`);
      },
    });
  }

  onFilter(): void {
    const criteria = this.convertFormToCriteria(this.searchForm);
    this.reservationService.findAll(criteria).subscribe({
      next: (data) => (this.reservations = data),
    });
  }

  onCreate(): void {
    this.router.navigate(['/reservation/create']);
  }

  onUserIdChange(value: any): void {
    this.searchForm.userId = value == null ? undefined : Number(value);
  }

  onUserIdClear(): void {
    this.searchForm.userId = undefined;
  }

  onPaymentStatusClear(): void {
    this.searchForm.paymentStatus = undefined;
  }

  private getTodayStart(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getTodayEnd(): Date {
    const date = new Date();
    date.setHours(23, 59, 0, 0);
    return date;
  }

  private convertFormToCriteria(form: SearchFormModel): SharedSearchReservationCriteriaDto {
    return {
      fromDate: form.fromDate ? this.formatDateForInputLocal(new Date(form.fromDate)) : undefined,
      toDate: form.toDate ? this.formatDateForInputLocal(new Date(form.toDate)) : undefined,
      userId: form.userId,
      paymentStatus: form.paymentStatus,
    };
  }

  private loadOwners(): void {
    this.authService.getCurrentUser().pipe(
      mergeMap(authUser => {
        return authUser.role === Role.ADMIN
          ? this.userService.findAll()
          : this.userService.findOne(authUser.id).pipe(
            map(user => [user])
          );
      })
    ).subscribe({
      next: users => {
        this.owners = users.map(user => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`
        }));
      },
      error: _ => this.toasterService.error("Impossible de charger les propriétaires.")
    });
  }

  private formatDateForInputLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


}
