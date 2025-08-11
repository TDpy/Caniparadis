import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, pairwise} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        pairwise()
      )
      .subscribe(([prev, curr]) => {
        this.previousUrl = prev.url;
        this.currentUrl = curr.url;
      });
  }

  public getPreviousUrl(): string | null {
    return this.previousUrl;
  }
}
