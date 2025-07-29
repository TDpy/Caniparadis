import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {catchError, EMPTY, switchMap, tap} from 'rxjs';

import {Table, TableColumnDirective} from '../../components/table/table';
import {AnimalService} from '../../services/animal.service';
import {ToasterService} from "../../services/toaster.service";

@Component({
  selector: 'app-animal',
  imports: [
    Table,
    TableColumnDirective,
    RouterModule,
  ],
  templateUrl: './animal.html',
  styleUrl: './animal.scss'
})
export class Animal implements OnInit {
  router = inject(Router);
  animals?: AnimalDto[];

  private toasterService = inject(ToasterService);
  private animalService = inject(AnimalService);

  getConfirmText: any = (row: AnimalDto) => `Supprimer l’animal ${row.name} ?`;

  ngOnInit(): void {
    this.animalService.findAll().subscribe(animals => {
      this.animals = animals;
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
