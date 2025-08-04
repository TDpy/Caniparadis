import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {SharedServiceTypeDto} from '@caniparadis/dtos/dist/serviceTypeDto';
import {catchError, of, switchMap, tap } from 'rxjs';

import {Table, TableColumnDirective} from '../../components/table/table';
import {ServiceTypeService} from '../../services/service-type.service';
import {ToasterService} from '../../services/toaster.service';

@Component({
  selector: 'app-service-type',
  imports: [
    Table,
    TableColumnDirective,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './service-type.html',
  standalone: true,
  styleUrl: './service-type.scss'
})
export class ServiceType implements OnInit{
  public serviceTypes: SharedServiceTypeDto[] = [];
  private serviceTypeService = inject(ServiceTypeService);
  private toasterService = inject(ToasterService);
  private router = inject(Router);

  getConfirmText: any = (row: SharedServiceTypeDto) => `Supprimer la prestation ${row.name} ?`;

  ngOnInit(): void {
    this.serviceTypeService.findAll().subscribe({
      next: (serviceTypes: SharedServiceTypeDto[]) => {
        this.serviceTypes = serviceTypes;
      },
      error: (_) => {
        this.toasterService.error(`Erreur lors de la récupération des prestations.`)
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/service-type/create']);
  }

  onDelete(serviceType: { id: number }): void {
    this.serviceTypeService.remove(serviceType.id).pipe(
      tap((removedServiceType) => {
        this.toasterService.success(
          `La prestation ${removedServiceType.name} a été correctement supprimée`
        );
      }),
      switchMap(() => this.serviceTypeService.findAll()),
      catchError(() => {
        this.toasterService.error("Impossible de supprimer la prestation. Veuillez réessayer");
        return of([]);
      })
    ).subscribe((serviceTypes) => {
      this.serviceTypes = serviceTypes;
    });
  }

  onEdit(event: any): void {
    if (event?.id) {
      this.router.navigate(['/service-type', event.id]);
    }
  }
}
