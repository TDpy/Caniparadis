import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {
  SharedCreateReservationDto, SharedProposeNewSlotDto,
  SharedReservationDto,
  SharedSearchReservationCriteriaDto, SharedUpdatePaymentDto, SharedUpdateReservationDto
} from '@caniparadis/dtos/dist/reservationDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);

  create(reservationDto: SharedCreateReservationDto): Observable<SharedReservationDto> {
    return this.http.post<SharedReservationDto>("/reservations", reservationDto)
  }

  findAll(searchCriteria?: SharedSearchReservationCriteriaDto): Observable<SharedReservationDto[]> {
    let params = new HttpParams();

    if (searchCriteria) {
      Object.entries(searchCriteria).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          let stringValue: string;

          if (value instanceof Date) {
            stringValue = value.toISOString().split('T')[0];
          } else if (typeof value === 'number' || typeof value === 'string') {
            stringValue = String(value);
          } else {
            return;
          }

          params = params.set(key, stringValue);
        }
      });
    }

    return this.http.get<SharedReservationDto[]>('/reservations', {params});
  }

  findOne(id: number): Observable<SharedReservationDto> {
    return this.http.get<SharedReservationDto>(`/reservations/${id}`)
  }

  update(id: number, serviceTypeDto: SharedUpdateReservationDto): Observable<SharedReservationDto> {
    return this.http.patch<SharedReservationDto>(`/reservations/${id}`, serviceTypeDto)
  }

  remove(id: number): Observable<SharedReservationDto> {
    return this.http.delete<SharedReservationDto>(`/reservations/${id}`)
  }

  accept(id: number): Observable<SharedReservationDto> {
    return this.http.post<SharedReservationDto>(`/reservations/${id}/accept`, {})
  }

  propose(id: number, newSlot: SharedProposeNewSlotDto): Observable<SharedReservationDto> {
    return this.http.post<SharedReservationDto>(`/reservations/${id}/propose`, newSlot)
  }

  cancel(id: number): Observable<SharedReservationDto> {
    return this.http.post<SharedReservationDto>(`/reservations/${id}/cancel`, {})
  }

  payment(id: number, payment: SharedUpdatePaymentDto): Observable<SharedReservationDto> {
    return this.http.post<SharedReservationDto>(`/reservations/${id}/payment`, payment)
  }
}
