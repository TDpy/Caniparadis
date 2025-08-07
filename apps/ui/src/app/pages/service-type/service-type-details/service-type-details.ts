import { CommonModule } from '@angular/common';
import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  SharedCreateServiceTypeDto,
  SharedServiceTypeDto,
  SharedUpdateServiceTypeDto
} from '@caniparadis/dtos/dist/serviceTypeDto';
import {NgSelectModule} from '@ng-select/ng-select';
import {catchError, EMPTY, tap } from 'rxjs';

import {ServiceTypeService} from '../../../services/service-type.service';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-service-type-details',
  imports: [FormsModule, CommonModule, NgSelectModule],
  templateUrl: './service-type-details.html',
  standalone: true,
  styleUrl: './service-type-details.scss'
})
export class ServiceTypeDetails {
  serviceType: Partial<SharedCreateServiceTypeDto & SharedUpdateServiceTypeDto> = {};
  formSubmitted = false;
  isEditMode = false;
  serviceTypeId?: number;

  private serviceTypeService = inject(ServiceTypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toasterService = inject(ToasterService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.serviceTypeId = +id;
        this.loadServiceType(this.serviceTypeId);
      }
    });
  }

  loadServiceType(id: number): void {
    this.serviceTypeService.findOne(id).subscribe({
      next: (serviceType: SharedServiceTypeDto) => {
        this.serviceType = {
          name: serviceType.name,
          description: serviceType.description,
          price: +serviceType.price
        };
      },
      error: () => {
        this.router.navigateByUrl('/service-type');
      },
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.isValid()) return;

    if (this.isEditMode && this.serviceTypeId) {
      const updateDto: SharedUpdateServiceTypeDto = {...this.serviceType};

      this.serviceTypeService.update(this.serviceTypeId, updateDto).pipe(
        tap((serviceType) => {
          this.toasterService.success(`La prestation ${serviceType.name} a été modifiée avec succès`);
          this.router.navigateByUrl('/service-type');
        }),
        catchError(() => {
          this.toasterService.error("Impossible de modifier la prestation. Veuillez réessayer");
          return EMPTY;
        })
      ).subscribe();
    } else {
      const createDto: SharedCreateServiceTypeDto = {...(this.serviceType as SharedCreateServiceTypeDto)};

      this.serviceTypeService.create(createDto).pipe(
        tap((serviceType) => {
          this.toasterService.success(`La prestation ${serviceType.name} a été créée avec succès`);
          this.router.navigateByUrl('/service-type');
        }),
        catchError(() => {
          this.toasterService.error("Impossible de créer la prestation. Veuillez réessayer");
          return EMPTY;
        })
      ).subscribe();
    }
  }

  isValid(): boolean {
    return !!(
      this.serviceType.name &&
      this.serviceType.description &&
        this.serviceType.price &&
        this.serviceType.price > 0
    );
  }

}
