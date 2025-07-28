import {Component, inject, OnInit} from '@angular/core';
import {Table, TableColumnDirective} from '../../components/table/table';
import {AnimalService} from '../../services/animal.service';
import {AnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {ToasterService} from "../../services/toaster.service";
import { Router, RouterModule } from '@angular/router';

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
  toasterService = inject(ToasterService);
  public animals?: AnimalDto[];

  constructor(public readonly service: AnimalService,
              private router: Router) {
  }

  getConfirmText = (row: AnimalDto) => `Supprimer l’animal ${row.name} ?`;

  ngOnInit() {
    this.service.findAll().subscribe(animals => {
      this.animals = animals;
    });
  }

  onDelete($event: any) {
    this.service.remove($event.id).subscribe(
      (animal) => {
        this.toasterService.success(`L'animal ${animal.name} a correctement été supprimé`)
        this.service.findAll().subscribe(animals => {
          this.animals = animals;
        });

      },
      _ => this.toasterService.error("Impossible de supprimer l'animal. Veuillez réessayer")
    )
  }

  onEdit(event: any) {
    if (event && event.id) {
      this.router.navigate(['/animal', event.id]);
    }
  }

  onCreate() {
    this.router.navigate(['/animal/create']);
  }
}
