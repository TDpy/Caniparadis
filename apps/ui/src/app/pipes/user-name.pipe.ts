import {Pipe, PipeTransform} from '@angular/core';
import {UserDto} from '@caniparadis/dtos/dist/userDto';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  transform(value: UserDto | undefined): string {
    if (value) {
      return `${value.firstName} ${value.lastName}`;
    }
    return "userName";
  }
}
