import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AnimalDto, CreateAnimalDto, UpdateAnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  constructor(private http: HttpClient) {
  }

  create(serviceTypeDto: CreateAnimalDto): Observable<AnimalDto> {
    return this.http.post<AnimalDto>("/animals", serviceTypeDto)
  }

  findAll(): Observable<AnimalDto[]> {
    return this.http.get<AnimalDto[]>("/animals")
  }

  findOne(id: number): Observable<AnimalDto> {
    return this.http.get<AnimalDto>(`/animals/${id}`)
  }

  update(animalId: number, animalDto: UpdateAnimalDto): Observable<AnimalDto> {
    return this.http.patch<AnimalDto>(`/animals/${animalId}`, animalDto)
  }

  remove(id: number): Observable<AnimalDto> {
    return this.http.delete<AnimalDto>(`/animals/${id}`)
  }
}
