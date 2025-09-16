import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilsService {
  formatDateForEmail(date: Date): string {
    const pad = (n: number): string => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
