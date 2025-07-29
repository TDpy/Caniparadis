import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import {ToasterService, ToastMessage} from '../../services/toaster.service';

@Component({
  selector: 'app-toaster-container',
  imports: [CommonModule],
  templateUrl: './toaster-container.html',
  styleUrl: './toaster-container.scss'
})
export class ToasterContainer {
  toasts: ToastMessage[] = [];
  private sub!: Subscription;

  constructor(private toaster: ToasterService) {}

  ngOnInit() {
    this.sub = this.toaster.toast$.subscribe(toast => {
      this.toasts.push(toast);
      timer(5000).subscribe(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  remove(toast: ToastMessage) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  getCombinedClasses(type: string = 'info'): string[] {
    return type === 'error' || type === 'success' ? ['bg-' + this.mapToBootstrapColor(type), 'text-white'] : ['bg-' + this.mapToBootstrapColor(type), 'text-dark'];
  }

  private mapToBootstrapColor(type: string): string {
    return type === 'error' ? 'danger' : type;
  }


  getIconClass(type: string = 'info'): string {
    switch (type) {
      case 'error': {
        return 'fa fa-exclamation-triangle';
      }
      case 'success': {
        return 'fa fa-check';
      }
      case 'warning': {
        return 'fa fa-exclamation-circle';
      }
      default: {
        return 'fa fa-info-circle';
      }
    }
  }


}
