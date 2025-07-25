import {Component} from '@angular/core';
import {Table, TableColumnDirective} from '../table/table';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-daily-schedule',
  imports: [Table, TableColumnDirective],
  templateUrl: './daily-schedule.html',
  styleUrl: './daily-schedule.scss',
})
export class DailySchedule {
  public tabMode: 'nursery' | 'other' = 'nursery';

  // TODO@DEV: Mock data, this should be replaced by a service call
  public datas = [
    {
      id: '1',
      name: 'Woof',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 3600000),
      price: 100
    },
  ];

  // TODO@DEV: Mock data, this should be replaced by a service call
  public otherDatas = [
    {
      id: '1',
      name: 'Miaou',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 3600000), // 1 hour later
      price: 100,
    },
    {
      id: '1',
      name: 'Awouuuuuuuu',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 3600000), // 1 hour later
      price: 100,
    },
  ];

  // TODO@DEV: Change this
  get dtaDtos() {
    return this.datas.map((data) => ({
      name: data.name,
      startDate: formatDate(data.startDate, 'HH:mm', 'en-US'),
      endDate: formatDate(data.endDate, 'HH:mm', 'en-US'),
      price: `${data.price} €`,
    }));
  }

  // TODO@DEV: Change this
  get otherDataDtos() {
    return this.otherDatas.map((data) => ({
      val1: data.name,
      val2: formatDate(data.startDate, 'HH:mm', 'en-US'),
      val3: formatDate(data.endDate, 'HH:mm', 'en-US'),
      val4: `${data.price} €`,
      val5: `Valeur blablaablabla`,
    }));
  }

  // TODO@DEV: Redirect to the detail page of the data
  dataClicked($event: any) {
    console.log($event);
  }
}
