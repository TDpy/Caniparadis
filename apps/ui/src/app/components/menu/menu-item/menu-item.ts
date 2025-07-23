import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  imports: [],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss',
})
export class MenuItem {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() link?: string;

  constructor(public router: Router) {}

  public redirectTo(link?: string) {
    if (link) {
      this.router.navigate([link]).then();
    }
  }
}
