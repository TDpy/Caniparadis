import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {SharedUpdateServiceTypeDto} from '@caniparadis/dtos/dist/serviceTypeDto';
import {Observable} from 'rxjs';
import {
  SharedCreateReservationDto,
  SharedReservationDto,
  SharedSearchReservationCriteriaDto
} from '@caniparadis/dtos/dist/reservationDto';

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

    return this.http.get<SharedReservationDto[]>('/reservations', { params });
  }

  findOne(id: number): Observable<SharedReservationDto> {
    return this.http.get<SharedReservationDto>(`/reservations/${id}`)
  }

  update(id: number, serviceTypeDto: SharedUpdateServiceTypeDto): Observable<SharedReservationDto> {
    return this.http.patch<SharedReservationDto>(`/reservations/${id}`, serviceTypeDto)
  }

  remove(id: number): Observable<SharedReservationDto> {
    return this.http.delete<SharedReservationDto>(`/reservations/${id}`)
  }
}
