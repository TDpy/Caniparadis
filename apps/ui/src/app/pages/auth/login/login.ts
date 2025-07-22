import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {LoginSignup} from '../../../components/login-signup/login-signup';
import {LoginDto} from '@caniparadis/dtos/dist/authDto';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {CommonModule} from '@angular/common';
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
  passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$';
  private authService = inject(AuthService);
  private toasterService = inject(ToasterService);

  constructor(
    private router: Router) {
  }


  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (!this.isValid()) return;

    const dto: LoginDto = {
      email: this.login.email,
      password: this.login.password,
    };

    this.authService.login(dto).subscribe(({token}) => {
        if (token) {
          this.authService.setToken(token);
          this.router.navigateByUrl('dashboard').then();
        } else {
          this.toasterService.error('Erreur lors de la connexion, veuillez réessayer.');
        }
      },
      () => {
        this.toasterService.error('Connexion impossible, vérifiez vos identifiants.');
      });
  }

  isValid(): boolean {
    const {email, password} = this.login;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
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


  redirectToSignUp() {
    this.router.navigateByUrl('auth/signup').then();
  }
  redirectToForgotPassword() {
    this.router.navigateByUrl('auth/forgot-password').then();
  }
}
