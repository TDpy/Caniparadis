import {Component, inject} from '@angular/core';
import {MenuItem} from './menu-item/menu-item';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';

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
