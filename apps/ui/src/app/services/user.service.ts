import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SharedCreateUserDto, SharedUpdateUserDto, SharedUserDto} from '@caniparadis/dtos/dist/userDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(userDto: SharedCreateUserDto): Observable<SharedUserDto> {
    return this.http.post<SharedUserDto>("/users", userDto)
  }

  findAll(): Observable<SharedUserDto[]> {
    return this.http.get<SharedUserDto[]>('/users');
  }

  findOne(id: number): Observable<SharedUserDto> {
    return this.http.get<SharedUserDto>(`/users/${id}`)
  }

  update(userId: string, userDto: SharedUpdateUserDto): Observable<SharedUserDto> {
    return this.http.patch<SharedUserDto>(`/users/${userId}`, userDto)
  }

  remove(id: number): Observable<SharedUserDto> {
    return this.http.delete<SharedUserDto>(`/users/${id}`)
  }

}
