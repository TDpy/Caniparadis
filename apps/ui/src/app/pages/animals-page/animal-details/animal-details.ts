import {Component, inject} from '@angular/core';
import {AnimalDto, AnimalSex, CreateAnimalDto, UpdateAnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {AnimalService} from '../../../services/animal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToasterService} from '../../../services/toaster.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-animal-details',
  imports: [FormsModule, CommonModule, NgSelectModule],
  templateUrl: './animal-details.html',
  styleUrl: './animal-details.scss'
})
export class AnimalDetails {
  animal: Partial<CreateAnimalDto & UpdateAnimalDto> = {
    sex: AnimalSex.MALE,
    isSterilized: false
  };
  formSubmitted = false;
  isEditMode = false;
  animalId?: number;
  sexes = Object.values(AnimalSex);
  owners: { id: number; firstName: string; lastName: string; email: string; fullName: string }[] = [];

  private animalService = inject(AnimalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toasterService = inject(ToasterService);
  private userService = inject(UserService);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.animalId = +id;
        this.loadAnimal(this.animalId);
      }
    });
    this.loadOwners();
  }

  loadAnimal(id: number) {
    this.animalService.findOne(id).subscribe({
      next: (animal: AnimalDto) => {
        this.animal = {
          name: animal.name,
          type: animal.type,
          breed: animal.breed,
          ownerId: animal.owner.id,
          sex: animal.sex,
          isSterilized: animal.isSterilized
        };
      },
      error: () => {
        this.router.navigateByUrl('/animal');
      },
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (!this.isValid()) return;

    if (this.isEditMode && this.animalId) {
      const updateDto: UpdateAnimalDto = {...this.animal};

      this.animalService.update(this.animalId, updateDto).subscribe(
        (animal) => {
          this.toasterService.success(`L'animal ${animal.name} a été modifié avec succès`);
          this.router.navigateByUrl('/animal');
        },
        _ => this.toasterService.error("Impossible de modifier l'animal. Veuillez réessayer")
      );
    } else {
      const createDto: CreateAnimalDto = {...(this.animal as CreateAnimalDto)};

      this.animalService.create(createDto).subscribe(
        (animal) => {
          this.toasterService.success(`L'animal ${animal.name} a été créé avec succès`);
          this.router.navigateByUrl('/animal');
        },
        _ => this.toasterService.error("Impossible de créer l'animal. Veuillez réessayer")
      );
    }
  }

  isValid(): boolean {
    return !!(
      this.animal.name &&
      this.animal.type &&
      this.animal.breed &&
      this.animal.ownerId &&
      this.animal.sex !== undefined &&
      this.animal.isSterilized !== undefined
    );
  }

  private loadOwners() {
    this.userService.findAll().subscribe({
      next: users => {
        this.owners = users.map(user => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`
        }));
      },
      error: _ => this.toasterService.error("Impossible de charger les propriétaires.")
    });
  }

}
