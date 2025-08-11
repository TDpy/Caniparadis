import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Role, SharedUserDto} from '@caniparadis/dtos/dist/userDto';
import {filter, Subscription} from 'rxjs';

import {UserNamePipe} from '../../pipes/user-name.pipe';
import {AuthService} from '../../services/auth.service';
import {MenuItem} from './menu-item/menu-item';

@Component({
  selector: 'app-menu',
  imports: [MenuItem, UserNamePipe, UserNamePipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  standalone: true
})
export class Menu implements OnInit, OnDestroy {
  protected user?: SharedUserDto
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscription: Subscription[] = []

  logout(): void {
    this.authService.logout(true);
  }

  ngOnInit(): void {
    this.loadData()

    this.subscription.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.loadData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach(s => s.unsubscribe());
  }

  private loadData(): void {
    this.subscription.push(
      this.authService.getCurrentUser().subscribe(user => {
        this.user = user;
      })
    );
  }

  protected readonly Role = Role;
}
