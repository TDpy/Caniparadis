import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  logout() {
    this.authService.logout(true);
  }
}
