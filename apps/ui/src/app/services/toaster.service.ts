import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface ToastMessage {
  text: string;
  type?: 'error' | 'info' | 'success' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  error(message: string): void {
    this.toastSubject.next({text: message, type: 'error'});
  }

  info(message: string): void {
    this.toastSubject.next({text: message, type: 'info'});
  }

  success(message: string): void {
    this.toastSubject.next({text: message, type: 'success'});
  }

  warning(message: string): void {
    this.toastSubject.next({text: message, type: 'warning'});
  }
}
