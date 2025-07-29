import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AnimalDto, CreateAnimalDto, UpdateAnimalDto} from '@caniparadis/dtos/dist/animalDto';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  constructor(private http: HttpClient) {}

  create(serviceTypeDto: CreateAnimalDto) {
    return this.http.post<AnimalDto>("/animals", serviceTypeDto)
  }

  findAll() {
    return this.http.get<AnimalDto[]>("/animals")
  }

  findOne(id: number) {
    return this.http.get<AnimalDto>(`/animals/${id}`)
  }

  update(animalId: number, animalDto: UpdateAnimalDto) {
    return this.http.patch<AnimalDto>(`/animals/${animalId}`, animalDto)
  }

  remove(id: number) {
    return this.http.delete<AnimalDto>(`/animals/${id}`)
  }
}
