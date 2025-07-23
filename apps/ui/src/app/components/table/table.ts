import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @Input() columns: string[] = [];
  @Input() datas: any[] = [];
  @Input() dataKeys: string[] = [];

  @Output() rowClick: EventEmitter<any> = new EventEmitter();

  onRowClick(data: any) {
    this.rowClick.emit(data);
  }
}
