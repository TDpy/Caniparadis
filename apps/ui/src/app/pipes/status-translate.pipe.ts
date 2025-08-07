import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'statusTranslate'
})
export class StatusTranslatePipe implements PipeTransform {

  private translations: Record<string, string> = {
    PENDING: 'En attente entreprise',
    CONFIRMED: 'Confirmé',
    PROPOSED: 'Proposé au client',
    CANCELLED: 'Annulé',
  };

  transform(value: string): string {
    return this.translations[value] ?? value;
  }
}
