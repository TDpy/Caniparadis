import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CreateUserDto, UpdateUserDto, UserDto} from '@caniparadis/dtos/dist/userDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(userDto: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>("/users", userDto)
  }

  findAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>('/users');
  }

  findOne(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`/users/${id}`)
  }

  update(userId: string, userDto: UpdateUserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`/users/${userId}`, userDto)
  }

  remove(id: number): Observable<UserDto> {
    return this.http.delete<UserDto>(`/users/${id}`)
  }

}
