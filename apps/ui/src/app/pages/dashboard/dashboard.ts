import {Component} from '@angular/core';
import {StatCard} from '../../components/stat-card/stat-card';
import {DailySchedule} from '../../components/daily-schedule/daily-schedule';

@Component({
  selector: 'app-dashboard',
  imports: [StatCard, DailySchedule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
