import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDto } from '@caniparadis/dtos/dist/userDto';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-user',
  imports: [Table],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class UserPage implements OnInit {
  public users: UserDto[] = [];

  constructor(private userService: UserService) {}

  get usersDtos() {
    return this.users.map((data: UserDto) => ({
      ...data,
      fullName: data.firstName + ' ' + data.lastName
    }));
  }

  ngOnInit() {
    this.userService.findAll().subscribe({
      next: (users: UserDto[]) => {
        this.users = users;
        console.log('Users fetched successfully:', this.users);
      },
      error: (error:any) => {
        console.error('Error fetching users:', error);
      },
    });
  }
}
