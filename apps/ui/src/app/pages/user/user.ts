import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserDto} from '@caniparadis/dtos/dist/userDto';
import {Table, TableColumnDirective} from '../../components/table/table';
import {ToasterService} from '../../services/toaster.service';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [Table, TableColumnDirective, RouterModule, CommonModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class UserPage implements OnInit {
  public users: UserDto[] = [];
  private userService = inject(UserService);
  private toasterService = inject(ToasterService);
  private router = inject(Router);

  get usersDtos() {
    return this.users.map((data: UserDto) => ({
      ...data,
      fullName: data.firstName + ' ' + data.lastName
    }));
  }

  getConfirmText = (row: UserDto) => `Supprimer l’utilisateur.trice ${row.firstName} ${row.lastName} ?`;

  ngOnInit() {
    this.userService.findAll().subscribe({
      next: (users: UserDto[]) => {
        this.users = users;
      },
      error: (error: any) => {
        this.toasterService.error(`Erreur lors de la récupération des utilisateurs.`)
      },
    });
  }

  onDelete($event: any) {
    this.userService.remove($event.id).subscribe(
      (user) => {
        this.toasterService.success(`L'utilisateur.trice ${user.firstName}  ${user.lastName} a correctement été supprimé.e`)
        this.userService.findAll().subscribe(users => {
          this.users = users;
        });
      },
      _ => this.toasterService.error("Impossible de supprimer l'utilisateur.trice. Veuillez réessayer")
    )
  }

  onCreate() {
    this.router.navigate(['/user/create']);
  }

  onEdit(event: any) {
    if (event && event.id) {
      this.router.navigate(['/user', event.id]);
    }
  }
}
