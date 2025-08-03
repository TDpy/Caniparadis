import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SharedAnimalDto, SharedCreateAnimalDto, SharedUpdateAnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  constructor(private http: HttpClient) {}

  create(serviceTypeDto: SharedCreateAnimalDto): Observable<SharedAnimalDto> {
    return this.http.post<SharedAnimalDto>("/animals", serviceTypeDto)
  }

  findAll(): Observable<SharedAnimalDto[]> {
    return this.http.get<SharedAnimalDto[]>("/animals")
  }

  findOne(id: number): Observable<SharedAnimalDto> {
    return this.http.get<SharedAnimalDto>(`/animals/${id}`)
  }

  update(animalId: number, animalDto: SharedUpdateAnimalDto): Observable<SharedAnimalDto> {
    return this.http.patch<SharedAnimalDto>(`/animals/${animalId}`, animalDto)
  }

  remove(id: number): Observable<SharedAnimalDto> {
    return this.http.delete<SharedAnimalDto>(`/animals/${id}`)
  }
}
