import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {UserDto} from '@caniparadis/dtos/dist/userDto';
import {catchError, of, switchMap, tap } from 'rxjs';

import {Table, TableColumnDirective} from '../../components/table/table';
import {ToasterService} from '../../services/toaster.service';
import {UserService} from '../../services/user.service';

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
      error: (_) => {
        this.toasterService.error(`Erreur lors de la récupération des utilisateurs.`)
      },
    });
  }

  onDelete(user: { id: number }) {
    this.userService.remove(user.id).pipe(
      tap((removedUser) => {
        this.toasterService.success(
          `L'utilisateur.trice ${removedUser.firstName} ${removedUser.lastName} a correctement été supprimé.e`
        );
      }),
      switchMap(() => this.userService.findAll()),
      catchError(() => {
        this.toasterService.error("Impossible de supprimer l'utilisateur.trice. Veuillez réessayer");
        return of([]);
      })
    ).subscribe((users) => {
      this.users = users;
    });
  }

  onCreate() {
    this.router.navigate(['/user/create']);
  }

  onEdit(event: any) {
    if (event?.id) {
      this.router.navigate(['/user', event.id]);
    }
  }
}
