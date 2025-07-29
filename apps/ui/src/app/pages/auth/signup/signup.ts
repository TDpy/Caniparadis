import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {SignUpDto} from '@caniparadis/dtos/dist/authDto';
import {catchError, EMPTY, tap} from 'rxjs';

import {LoginSignup} from "../../../components/login-signup/login-signup";
import {AuthService} from '../../../services/auth.service';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    LoginSignup,
    FormsModule,
    CommonModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  signUp: SignUpDto = new SignUpDto();
  confirmPassword: string = '';
  confirmTouched: boolean = false;
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

    const dto: SignUpDto = {
      email: this.signUp.email,
      password: this.signUp.password,
      firstName: this.signUp.firstName,
      lastName: this.signUp.lastName,
    };

    this.authService.signUp(dto).pipe(
      tap(() => {
        this.redirectToLogin();
        this.toasterService.success("Compte créé avec succès");
      }),
      catchError(() => {
        this.toasterService.error("Un souci est apparu. Veuillez réessayer.");
        return EMPTY;
      })
    ).subscribe();
  }

  isValid(): boolean {
    const {email, password, firstName, lastName} = this.signUp;
    const emailRegex = /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/;
    const pwdRegex = new RegExp(this.passwordPattern);

    if (!email || !password || !firstName || !lastName || !this.confirmPassword) {
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

    if (password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return false;
    }

    return true;
  }

  redirectToLogin(): void {
    this.router.navigateByUrl('auth/login');
  }
}
