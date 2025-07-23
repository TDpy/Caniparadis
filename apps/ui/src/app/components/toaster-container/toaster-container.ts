import { Component } from '@angular/core';
import {ToasterService, ToastMessage} from '../../services/toaster.service';
import { Subscription, timer } from 'rxjs';
import { CommonModule } from '@angular/common';

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
    switch (type) {
      case 'success':
      case 'error':
        return ['bg-' + this.mapToBootstrapColor(type), 'text-white'];
      case 'warning':
      case 'info':
      case 'primary':
      default:
        return ['bg-' + this.mapToBootstrapColor(type), 'text-dark'];
    }
  }

  private mapToBootstrapColor(type: string): string {
    switch (type) {
      case 'error': return 'danger';
      default: return type;
    }
  }


  getIconClass(type: string = 'info'): string {
    switch (type) {
      case 'success':
        return 'fa fa-check';
      case 'error':
        return 'fa fa-exclamation-triangle';
      case 'warning':
        return 'fa fa-exclamation-circle';
      case 'info':
      default:
        return 'fa fa-info-circle';
    }
  }


}
