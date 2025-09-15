import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCard {
  @Input({required: true}) title: string = '';
  @Input({required: true}) totalBooking: number = 0;
  @Input() cardStyle: DashboardCardStyle | undefined = undefined;

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  generateCardClass(): string {
    if (this.totalBooking > 0 && this.cardStyle === DashboardCardStyle.WARNING) {
      return "warning";
    } else if (this.totalBooking > 0 && this.cardStyle === DashboardCardStyle.DANGER) {
      return "danger";
    }
    return "success";
  }

  generateIconClass(): string {
    if (this.totalBooking > 0 && this.cardStyle === DashboardCardStyle.WARNING) {
      return 'fas fa-exclamation-triangle text-warning';
    } else if (this.totalBooking > 0 && this.cardStyle === DashboardCardStyle.DANGER) {
      return 'fas fa-exclamation-triangle text-danger';
    }
    return 'fas fa-check-circle text-success';
  }

  public onRedirectionClick(): void {
    this.onClick.emit();
  }
}

export enum DashboardCardStyle {
  DANGER = 'DANGER',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}

