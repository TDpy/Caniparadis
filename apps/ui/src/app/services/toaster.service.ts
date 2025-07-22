import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface ToastMessage {
  text: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  error(message: string) {
    this.toastSubject.next({text: message, type: 'error'});
  }

  info(message: string) {
    this.toastSubject.next({text: message, type: 'info'});
  }

  success(message: string) {
    this.toastSubject.next({text: message, type: 'success'});
  }

  warning(message: string) {
    this.toastSubject.next({text: message, type: 'warning'});
  }
}
