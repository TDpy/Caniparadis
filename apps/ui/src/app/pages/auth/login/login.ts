import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginDto} from '@caniparadis/dtos/dist/authDto';
import {catchError, EMPTY, tap} from 'rxjs';

import {LoginSignup} from '../../../components/login-signup/login-signup';
import {AuthService} from '../../../services/auth.service';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-login',
  imports: [
    LoginSignup,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  login: LoginDto = new LoginDto;
  formSubmitted: boolean = false;
  errorMessage: string = '';
  passwordPattern: string = String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`;

  private authService = inject(AuthService);
  private toasterService = inject(ToasterService);
  private router = inject(Router);

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (!this.isValid()) return;

    const dto: LoginDto = {
      email: this.login.email,
      password: this.login.password,
    };

    this.authService.login(dto).pipe(
      tap(({token}) => {
        if (token) {
          this.authService.setToken(token);
          this.router.navigateByUrl('dashboard').then();
        } else {
          this.toasterService.error('Erreur lors de la connexion, veuillez réessayer.');
        }
      }),
      catchError(() => {
        this.toasterService.error('Connexion impossible, vérifiez vos identifiants.');
        return EMPTY;
      })
    ).subscribe();
  }

  isValid(): boolean {
    const {email, password} = this.login;
    const emailRegex = /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/;
    const pwdRegex = new RegExp(this.passwordPattern);

    if (!email || !password) {
      this.errorMessage = 'Tous les champs sont requis.';
      return false;
    }

    if (!emailRegex.test(email)) {
      this.errorMessage = 'Email invalide.';
      return false;
    }

    if (!pwdRegex.test(password)) {
      this.errorMessage = 'Le mot de passe est trop faible.';
      return false;
    }

    return true;
  }


  redirectToSignUp(): void {
    this.router.navigateByUrl('auth/signup').then();
  }

  redirectToForgotPassword(): void {
    this.router.navigateByUrl('auth/forgot-password');
  }
}
