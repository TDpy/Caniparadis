import {Pipe, PipeTransform} from '@angular/core';
import {SharedUserDto} from '@caniparadis/dtos/dist/userDto';

@Pipe({
  standalone: true,
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  transform(value: SharedUserDto | undefined): string {
    if (value) {
      return `${value.firstName} ${value.lastName}`;
    }
    return "userName";
  }
}
