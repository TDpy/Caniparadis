import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {SharedCreateReservationDto} from '@caniparadis/dtos/dist/reservationDto';
import {Role} from '@caniparadis/dtos/dist/userDto';
import {NgSelectModule} from '@ng-select/ng-select';
import {switchMap} from 'rxjs';

import {AnimalService} from '../../../services/animal.service';
import {AuthService} from '../../../services/auth.service';
import {ReservationService} from '../../../services/reservation.service';
import {ServiceTypeService} from '../../../services/service-type.service';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-reservation-creation',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './reservation-creation.html',
  standalone: true,
  styleUrl: './reservation-creation.scss'
})
export class ReservationCreation {
  reservation: SharedCreateReservationDto = {
    animalId: 0,
    serviceTypeId: 0,
    startDate: new Date().toString(),
    endDate: '',
    comment: '',
  };
  animals: { id: number; name: string }[] = [];
  serviceTypes: { id: number; name: string }[] = [];
  formSubmitted = false;

  private animalService = inject(AnimalService);
  private serviceTypeService = inject(ServiceTypeService);
  private reservationService = inject(ReservationService);
  private toasterService = inject(ToasterService);
  private authService = inject(AuthService);
  private router = inject(Router);

  get isDateRangeInvalid(): boolean {
    if (!this.reservation.startDate || !this.reservation.endDate) return false;
    return new Date(this.reservation.startDate) >= new Date(this.reservation.endDate);
  }

  ngOnInit(): void {
    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 0, 0);

    this.reservation.startDate = this.formatLocalDateTime(start);
    this.reservation.endDate = this.formatLocalDateTime(end);

    this.authService.getCurrentUser().pipe(
      switchMap((authUser) => {
        return authUser.role === Role.ADMIN ?
          this.animalService.findAll() :
          this.animalService.findByOwnerId(authUser.id);
      })
    ).subscribe({
      next: (data) => (this.animals = data),
    });

    this.serviceTypeService.findAll().subscribe({
      next: (data) => (this.serviceTypes = data),
    });
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

  isValid(): boolean {
    const r = this.reservation;
    return (
      !!r.animalId &&
      !!r.serviceTypeId &&
      !!r.startDate &&
      !!r.endDate &&
      !this.isDateRangeInvalid
    );
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.isValid()) return;

    this.reservationService.create(this.reservation).subscribe({
      next: (reservation) => {
        this.toasterService.success('Réservation créée avec succès');
        this.router.navigateByUrl(`/reservation/${reservation.id}`);
      },
      error: () => {
        this.toasterService.error("Erreur lors de la création de la réservation.");
      },
    });
  }
}
