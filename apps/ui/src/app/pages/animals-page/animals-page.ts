import {Component, OnInit} from '@angular/core';
import {Table} from '../../components/table/table';
import {AnimalService} from '../../services/animal.service';
import {AnimalDto} from '@caniparadis/dtos/dist/animalDto';

@Component({
  selector: 'app-animals-page',
  imports: [
    Table
  ],
  templateUrl: './animals-page.html',
  styleUrl: './animals-page.scss'
})
export class AnimalsPage implements OnInit {
  public animals?: AnimalData[];

  constructor(public readonly service: AnimalService) {
  }

  ngOnInit() {
    this.service.findAll().subscribe(animals => {
      this.animals = animals.map(item => this.toData(item));
    });
  }

  toData(animal: AnimalDto): AnimalData {
    return {
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      sex: this.capitalizeOnlyFirstLetter(animal.sex.toString()),
      isSterilized: animal.isSterilized ? "Oui" : "Non",
      owner: `${animal.owner.firstName} ${animal.owner.lastName}`,
    } as AnimalData
  }

  capitalizeOnlyFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
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
