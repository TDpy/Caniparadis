import {Component, inject, OnInit} from '@angular/core';
import {Role} from '@caniparadis/dtos/dist/userDto';

import {AuthService} from '../../services/auth.service';
import {DashboardAdmin} from './dashboard-admin/dashboard-admin';
import {DashboardClient} from './dashboard-client/dashboard-client';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardAdmin, DashboardClient],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public isAdmin: boolean = false;
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => this.isAdmin = user.role === Role.ADMIN);
  }
}
