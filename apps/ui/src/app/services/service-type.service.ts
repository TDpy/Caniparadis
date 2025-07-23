import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateServiceTypeDto, ServiceTypeDto} from '@caniparadis/dtos/dist/serviceTypeDto';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  constructor(private http: HttpClient) {
  }

  create(serviceTypeDto: CreateServiceTypeDto) {
    return this.http.post<ServiceTypeDto>("/service-type", serviceTypeDto)
  }

  findAll() {
    return this.http.get<ServiceTypeDto[]>("/service-type")
  }

  findOne(id: number) {
    return this.http.get<ServiceTypeDto>(`/service-type/${id}`)
  }

  update(serviceTypeDto: ServiceTypeDto) {
    return this.http.patch<ServiceTypeDto>(`/service-type/${serviceTypeDto.id}`, serviceTypeDto)
  }

  remove(id: number) {
    return this.http.delete<ServiceTypeDto>(`/service-type/${id}`)
  }
}
