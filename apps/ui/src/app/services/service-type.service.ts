import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SharedCreateServiceTypeDto, SharedServiceTypeDto} from '@caniparadis/dtos/dist/serviceTypeDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  constructor(private http: HttpClient) {}

  create(serviceTypeDto: SharedCreateServiceTypeDto): Observable<SharedServiceTypeDto> {
    return this.http.post<SharedServiceTypeDto>("/service-type", serviceTypeDto)
  }

  findAll(): Observable<SharedServiceTypeDto[]> {
    return this.http.get<SharedServiceTypeDto[]>("/service-type")
  }

  findOne(id: number): Observable<SharedServiceTypeDto> {
    return this.http.get<SharedServiceTypeDto>(`/service-type/${id}`)
  }

  update(serviceTypeDto: SharedServiceTypeDto): Observable<SharedServiceTypeDto> {
    return this.http.patch<SharedServiceTypeDto>(`/service-type/${serviceTypeDto.id}`, serviceTypeDto)
  }

  remove(id: number): Observable<SharedServiceTypeDto> {
    return this.http.delete<SharedServiceTypeDto>(`/service-type/${id}`)
  }
}
