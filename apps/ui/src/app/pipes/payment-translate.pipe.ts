import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'paymentTranslate',
})
@Injectable({ providedIn: 'root' })
export class PaymentTranslatePipe implements PipeTransform {

  private translations: Record<string, string> = {
    PENDING: 'En attente',
    PAID: 'Payé',
    REFUNDED: 'Remboursé',
  };

  transform(value: string): string {
    return this.translations[value] ?? value;
  }
}
