import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {
  PaymentStatus,
  SharedReservationDto
} from '@caniparadis/dtos/dist/reservationDto';
import {Role, SharedUserDto} from '@caniparadis/dtos/dist/userDto';
import {NgSelectModule} from '@ng-select/ng-select';

import {AuthService} from '../../../services/auth.service';
import {ReservationService} from '../../../services/reservation.service';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-reservation-details',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './reservation-details.html',
  standalone: true,
  styleUrl: './reservation-details.scss'
})
export class ReservationDetails {
  reservation!: SharedReservationDto;
  proposeStartDate: string = '';
  proposeEndDate: string = '';
  proposeComment: string = '';
  paymentAmount: number = 0;
  amoutPaid: number = 0;
  currentUser!: SharedUserDto;
  protected readonly Role = Role;
  private reservationService = inject(ReservationService);
  private toasterService = inject(ToasterService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const reservationId = Number(this.route.snapshot.paramMap.get('id'));
    this.reservationService.findOne(reservationId).subscribe({
      next: (data) => {
        this.reservation = data;
        this.reservation.status = data.status;
        this.reservation.paymentStatus = data.paymentStatus;
        this.amoutPaid = data.amountPaid ?? 0;
      },
      error: () => {
        this.toasterService.error("Erreur lors du chargement de la réservation.");
      }
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });


    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 0);

    this.proposeStartDate = this.formatLocalDateTime(start);
    this.proposeEndDate = this.formatLocalDateTime(end);

  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  formatLocalDateTime(date: Date): string {
    const pad = (n: number): string => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  accept(): void {
    if (!this.reservation) return;
    this.reservationService.accept(this.reservation.id).subscribe({
      next: (res) => {
        this.toasterService.success('Réservation acceptée.');
        this.reservation = res;
      },
      error: () => this.toasterService.error('Erreur lors de l’acceptation.')
    });
  }

  cancel(): void {
    if (!this.reservation) return;
    this.reservationService.cancel(this.reservation.id).subscribe({
      next: (res) => {
        this.toasterService.success('Réservation annulée.');
        this.reservation = res;
      },
      error: () => this.toasterService.error('Erreur lors de l’annulation.')
    });
  }

  proposeNewSlot(): void {
    if (!this.reservation) return;
    if (!this.proposeStartDate || !this.proposeEndDate) {
      this.toasterService.error('Veuillez renseigner les dates.');
      return;
    }

    this.reservationService.propose(this.reservation.id, {
      startDate: this.proposeStartDate,
      endDate: this.proposeEndDate,
      comment: this.proposeComment || undefined,
    }).subscribe({
      next: (res) => {
        this.toasterService.success('Créneau reproposé.');
        this.reservation = res;
        this.proposeComment = '';
        this.proposeStartDate = '';
        this.proposeEndDate = '';
      },
      error: () => this.toasterService.error('Erreur lors de la reproposition.')
    });
  }

  updatePayment(): void {
    if (!this.reservation) return;
    if (this.paymentAmount == null || this.paymentAmount < 0) {
      this.toasterService.error('Montant invalide.');
      return;
    }

    this.reservationService.payment(this.reservation.id, {
      amountPaid: this.paymentAmount,
    }).subscribe({
      next: (res) => {
        this.toasterService.success('Paiement enregistré.');
        this.reservation = res;
        this.amoutPaid = res.amountPaid ?? 0;
        this.paymentAmount = 0;
      },
      error: () => this.toasterService.error('Erreur lors du paiement.')
    });
  }

  refund(): void {
    this.reservationService.payment(this.reservation.id, {
      status: PaymentStatus.REFUNDED
    }).subscribe({
      next: (res) => {
        this.toasterService.success('Remboursement enregistré.');
        this.reservation = res;
        this.paymentAmount = 0;
      },
      error: () => this.toasterService.error('Erreur lors du remboursement.')
    });
  }

  isPaymentDisabled(): boolean {
    return this.reservation.status === 'CANCELLED' ||
      (+this.amoutPaid + +this.paymentAmount > this.reservation?.serviceType?.price)
  }

  isAcceptDisabled(): boolean {
    if (!this.currentUser || !this.reservation) return true;

    return this.currentUser.role === Role.ADMIN ?
      this.reservation.status === 'CANCELLED' || this.reservation.status === 'CONFIRMED' :
      this.reservation.status !== 'PROPOSED';
  }
}
