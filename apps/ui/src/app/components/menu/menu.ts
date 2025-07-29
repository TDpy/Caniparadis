import {Component, inject} from '@angular/core';

import {AuthService} from '../../services/auth.service';
import {MenuItem} from './menu-item/menu-item';

@Component({
  selector: 'app-menu',
  imports: [MenuItem],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout(true);
  }
}
