import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CreateServiceTypeDto, ServiceTypeDto} from '@caniparadis/dtos/dist/serviceTypeDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  constructor(private http: HttpClient) {}

  create(serviceTypeDto: CreateServiceTypeDto): Observable<ServiceTypeDto> {
    return this.http.post<ServiceTypeDto>("/service-type", serviceTypeDto)
  }

  findAll(): Observable<ServiceTypeDto[]> {
    return this.http.get<ServiceTypeDto[]>("/service-type")
  }

  findOne(id: number): Observable<ServiceTypeDto> {
    return this.http.get<ServiceTypeDto>(`/service-type/${id}`)
  }

  update(serviceTypeDto: ServiceTypeDto): Observable<ServiceTypeDto> {
    return this.http.patch<ServiceTypeDto>(`/service-type/${serviceTypeDto.id}`, serviceTypeDto)
  }

  remove(id: number): Observable<ServiceTypeDto> {
    return this.http.delete<ServiceTypeDto>(`/service-type/${id}`)
  }
}
