import {Component, inject, OnInit} from '@angular/core';
import {Role} from '@caniparadis/dtos/dist/userDto';

import {AuthService} from '../../services/auth.service';
import {DashboardAdmin} from './dashboard-admin/dashboard-admin';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardAdmin],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
  private authService = inject(AuthService);
  public isAdmin: boolean = false;

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => this.isAdmin = user.role === Role.ADMIN);
  }
}
