import {Component} from '@angular/core';

import {DailySchedule} from '../../components/daily-schedule/daily-schedule';
import {StatCard} from '../../components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [StatCard, DailySchedule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
