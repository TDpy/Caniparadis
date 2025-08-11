import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {SharedAnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {Role} from '@caniparadis/dtos/dist/userDto';
import {catchError, EMPTY, switchMap, tap} from 'rxjs';

import {Table, TableColumnDirective} from '../../components/table/table';
import {AnimalService} from '../../services/animal.service';
import {AuthService} from '../../services/auth.service';
import {ToasterService} from "../../services/toaster.service";

@Component({
  selector: 'app-animal',
  imports: [
    Table,
    TableColumnDirective,
    RouterModule,
  ],
  templateUrl: './animal.html',
  standalone: true,
  styleUrl: './animal.scss'
})
export class Animal implements OnInit {
  router = inject(Router);
  animals?: SharedAnimalDto[] = [];

  private authService = inject(AuthService);
  private toasterService = inject(ToasterService);
  private animalService = inject(AnimalService);

  getConfirmText: any = (row: SharedAnimalDto) => `Supprimer l’animal ${row.name} ?`;

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(
        switchMap(authUser => {
        return authUser.role === Role.ADMIN ?
          this.animalService.findAll() :
          this.animalService.findByOwnerId(authUser.id);
      })
    ).subscribe({
      next: (animals: SharedAnimalDto[]) => {
        this.animals = animals;
      },
      error: (_) => {
        this.toasterService.error(`Erreur lors de la récupération des animaux.`)
      },
    });
  }

  onDelete($event: any): void {
    this.animalService.remove($event.id).pipe(
      tap((animal) => {
        this.toasterService.success(`L'animal ${animal.name} a correctement été supprimé`);
      }),
      switchMap(() => this.animalService.findAll()),
      tap((animals) => {
        this.animals = animals;
      }),
      catchError(() => {
        this.toasterService.error("Impossible de supprimer l'animal. Veuillez réessayer");
        return EMPTY;
      })
    ).subscribe();
  }

  onEdit(event: any): void {
    if (event?.id) {
      this.router.navigate(['/animal', event.id]);
    }
  }

  onCreate(): void {
    this.router.navigate(['/animal/create']);
  }
}
