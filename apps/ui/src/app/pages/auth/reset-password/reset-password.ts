import { Component, inject } from '@angular/core';
import {LoginSignup} from '../../../components/login-signup/login-signup';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PasswordDto, SignUpDto} from '@caniparadis/dtos/dist/authDto';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [
    LoginSignup,
    FormsModule,
    CommonModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  signUp: PasswordDto = new PasswordDto();
  confirmPassword: string = '';
  confirmTouched: boolean = false;
  formSubmitted: boolean = false;
  errorMessage: string = '';
  passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$';
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private resetToken: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.resetToken = params.get('id') ?? '';
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (!this.isValid()) return;

    const dto: PasswordDto = {
      password: this.signUp.password,
    };

    this.authService.resetPassword(dto, this.resetToken).subscribe((success) => {

    });
  }

  isValid(): boolean {
    const { password} = this.signUp;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const pwdRegex = new RegExp(this.passwordPattern);

    if (!password || !this.confirmPassword) {
      this.errorMessage = 'Tous les champs sont requis.';
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

  redirectToLogIn() {
    this.router.navigateByUrl('login');
  }

}
