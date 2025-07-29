import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

import {ToasterContainer} from './components/toaster-container/toaster-container';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  authService = inject(AuthService);
  router = inject(Router);
  protected readonly title = signal('ui');

  ngOnInit() {
    this.authService.initializeToken();
  }

}
