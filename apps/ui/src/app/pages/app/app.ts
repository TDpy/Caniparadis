import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {Menu} from '../../components/menu/menu';

@Component({
  selector: 'app-app',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
