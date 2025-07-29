import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AnimalDto, AnimalSex, CreateAnimalDto, UpdateAnimalDto} from '@caniparadis/dtos/dist/animalDto';
import {NgSelectModule} from '@ng-select/ng-select';
import {catchError, EMPTY, tap} from 'rxjs';

import {AnimalService} from '../../../services/animal.service';
import {ToasterService} from '../../../services/toaster.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-animal-details',
  imports: [FormsModule, CommonModule, NgSelectModule],
  templateUrl: './animal-details.html',
  styleUrl: './animal-details.scss'
})
export class AnimalDetails implements OnInit {
  animal: Partial<CreateAnimalDto & UpdateAnimalDto> = {
    sex: AnimalSex.MALE,
    isSterilized: false
  };
  formSubmitted = false;
  isEditMode = false;
  animalId?: number;
  sexes = Object.values(AnimalSex);
  owners: { id: number; email: string; firstName: string; fullName: string; lastName: string }[] = [];

  private animalService = inject(AnimalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toasterService = inject(ToasterService);
  private userService = inject(UserService);

  ngOnInit(): void {
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

  loadAnimal(id: number): void {
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

  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.isValid()) return;

    if (this.isEditMode && this.animalId) {
      const updateDto: UpdateAnimalDto = {...this.animal};

      this.animalService.update(this.animalId, updateDto).pipe(
        tap((animal) => {
          this.toasterService.success(`L'animal ${animal.name} a été modifié avec succès`);
          this.router.navigateByUrl('/animal');
        }),
        catchError(() => {
          this.toasterService.error("Impossible de modifier l'animal. Veuillez réessayer");
          return EMPTY;
        })
      ).subscribe();
    } else {
      const createDto: CreateAnimalDto = {...(this.animal as CreateAnimalDto)};

      this.animalService.create(createDto).pipe(
        tap((animal) => {
          this.toasterService.success(`L'animal ${animal.name} a été créé avec succès`);
          this.router.navigateByUrl('/animal');
        }),
        catchError(() => {
          this.toasterService.error("Impossible de créer l'animal. Veuillez réessayer");
          return EMPTY;
        })
      ).subscribe();
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

  private loadOwners(): void {
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
