import {CommonModule} from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';

@Directive({
  selector: '[column]'
})
export class TableColumnDirective {
  @Input('column') name!: string;

  constructor(public template: TemplateRef<any>) {
  }
}

@Component({
  selector: 'app-table',
  imports: [
    CommonModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table implements AfterContentInit {
  @Input() data: any[] = [];
  @Input() isActionColumnDisplayed: boolean = false;
  @Input() getDeleteConfirmText!: (row: any) => string;

  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();

  @ContentChildren(TableColumnDirective) columnTemplates!: QueryList<TableColumnDirective>;

  columns: { name: string, template: TemplateRef<any> }[] = [];

  ngAfterContentInit(): void {
    this.columns = this.columnTemplates.map(col => ({
      name: col.name,
      template: col.template
    }));
  }

  confirmDelete(row: any): void {
    const text = this.getDeleteConfirmText ? this.getDeleteConfirmText(row) : 'Êtes-vous sûr ?';
    if (confirm(text)) {
      this.delete.emit(row);
    }
  }

}
