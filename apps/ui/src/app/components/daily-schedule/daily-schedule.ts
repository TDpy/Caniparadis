import {formatDate} from '@angular/common';
import {Component} from '@angular/core';

import {Table, TableColumnDirective} from '../table/table';

@Component({
  selector: 'app-daily-schedule',
  imports: [Table, TableColumnDirective],
  templateUrl: './daily-schedule.html',
  styleUrl: './daily-schedule.scss',
})
export class DailySchedule {
  public tabMode: 'nursery' | 'other' = 'nursery';

  public datas = [
    {
      id: '1',
      name: 'Woof',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3_600_000),
      price: 100
    },
  ];

  public otherDatas = [
    {
      id: '1',
      name: 'Miaou',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3_600_000), // 1 hour later
      price: 100,
    },
    {
      id: '1',
      name: 'Awouuuuuuuu',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3_600_000), // 1 hour later
      price: 100,
    },
  ];

  get dtaDtos(): any {
    return this.datas.map((data) => ({
      name: data.name,
      startDate: formatDate(data.startDate, 'HH:mm', 'en-US'),
      endDate: formatDate(data.endDate, 'HH:mm', 'en-US'),
      price: `${data.price} €`,
    }));
  }

  get otherDataDtos(): any {
    return this.otherDatas.map((data) => ({
      val1: data.name,
      val2: formatDate(data.startDate, 'HH:mm', 'en-US'),
      val3: formatDate(data.endDate, 'HH:mm', 'en-US'),
      val4: `${data.price} €`,
      val5: `Valeur blablaablabla`,
    }));
  }

  dataClicked($event: any): void {
    console.log($event);
  }
}
