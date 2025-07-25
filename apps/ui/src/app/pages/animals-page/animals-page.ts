import {Component, inject, OnInit} from '@angular/core';
import {Table, TableColumnDirective} from '../../components/table/table';
import {AnimalService} from '../../services/animal.service';
import {AnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {ToasterService} from "../../services/toaster.service";

@Component({
  selector: 'app-animals-page',
  imports: [
    Table,
    TableColumnDirective
  ],
  templateUrl: './animals-page.html',
  styleUrl: './animals-page.scss'
})
export class AnimalsPage implements OnInit {
  toasterService = inject(ToasterService);
  public animals?: AnimalData[];

  constructor(public readonly service: AnimalService) {
  }

  getConfirmText = (row: AnimalData) => `Supprimer l’animal ${row.name} ?`;

  ngOnInit() {
    this.service.findAll().subscribe(animals => {
      this.animals = animals.map(item => this.toData(item));
    });
  }

  toData(animal: AnimalDto): AnimalData {
    return {
      id: animal.id,
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      sex: (animal.sex === "MALE") ? "Mâle" : "Femelle",
      isSterilized: animal.isSterilized ? "Oui" : "Non",
      owner: `${animal.owner.firstName} ${animal.owner.lastName}`,
    } as AnimalData
  }

  onDelete($event: any) {
    this.service.remove($event.id).subscribe(
      (animal) => {
        this.toasterService.success(`L'animal ${animal.name} a correctement été supprimé`)
        this.service.findAll().subscribe(animals => {
          this.animals = animals.map(item => this.toData(item));
        });

      },
      _ => this.toasterService.error("Impossible de supprimer l'animal. Veuillez réessayer")
    )
  }

  onEdit($event: any) {
    console.log("edit", $event)
  }
}

export interface AnimalData {
  name: string;
  type: string;
  breed: string;
  sex: string;
  isSterilized: string;
  owner: string;
}
