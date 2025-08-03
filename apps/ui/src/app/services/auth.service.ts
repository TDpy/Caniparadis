import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import {EmailDto, LoginDto, PasswordDto, SignUpDto,} from '@caniparadis/dtos/dist/authDto';
import {UserDto} from '@caniparadis/dtos/dist/userDto';
import {BehaviorSubject, Observable} from 'rxjs';

import {ToasterService} from './toaster.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public tokenSubject = new BehaviorSubject<string | null>(null);
  private router = inject(Router);
  private toasterService = inject(ToasterService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>('/auth/me');
  }

  signUp(signup: SignUpDto): Observable<boolean> {
    return this.http.post<boolean>('/auth/signup', signup);
  }

  login(login: LoginDto): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/auth/login', login);
  }

  getToken(): string | null {
    if (!this.tokenSubject.value && isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return this.tokenSubject.value;
  }

  setToken(token: string): void {
    this.tokenSubject.next(token);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  initializeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        this.tokenSubject.next(storedToken);
      }
    }
  }

  logout(displayToaster: boolean = true): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this.http.post<void>('/auth/logout', {}).subscribe();
    this.tokenSubject.next(null);
    if (displayToaster) {
      this.toasterService.success("Déconnexion effectuée avec succès")
    }
    this.router.navigateByUrl('auth/login');
  }

  forgotPassword(email: EmailDto): Observable<boolean> {
    return this.http.post<boolean>('/auth/forgot-password', email);
  }

  resetPassword(
    password: PasswordDto,
    resetToken: string,
  ): Observable<boolean> {
    return this.http.post<boolean>('/auth/update-password', password, {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    });
  }
}
