import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateUserDto, UserDto} from '@caniparadis/dtos/dist/userDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  create(userDto: CreateUserDto) {
    return this.http.post<UserDto>("/user", userDto)
  }

  findAll() {
    return this.http.get<UserDto[]>('/users');
  }

  findOne(id: number) {
    return this.http.get<UserDto>(`/users/${id}`)
  }

  update(userDto: UserDto) {
    return this.http.patch<UserDto>(`/users/${userDto.id}`, userDto)
  }

  remove(id: number) {
    return this.http.delete<UserDto>(`/users/${id}`)
  }

}
