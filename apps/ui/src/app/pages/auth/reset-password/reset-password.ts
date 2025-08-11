import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedPasswordDto} from '@caniparadis/dtos/dist/authDto';
import {catchError, EMPTY, tap} from 'rxjs';

import {LoginSignup} from '../../../components/login-signup/login-signup';
import {AuthService} from '../../../services/auth.service';
import {ToasterService} from '../../../services/toaster.service';

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
export class ResetPassword implements OnInit {
  signUp: SharedPasswordDto = {password: ''};
  confirmPassword: string = '';
  confirmTouched: boolean = false;
  formSubmitted: boolean = false;
  errorMessage: string = '';
  passwordPattern: string = String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`;
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toasterService = inject(ToasterService);
  private resetToken: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.resetToken = params.get('id') ?? '';
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (!this.isValid()) return;

    const dto: SharedPasswordDto = {
      password: this.signUp.password,
    };

    this.authService.resetPassword(dto, this.resetToken).pipe(
      tap(() => {
        this.toasterService.success("Nouveau mot de passe enregistré. Vous pouvez vous connecter.");
        this.router.navigateByUrl('auth/login');
      }),
      catchError(() => {
        this.toasterService.error("Erreur lors de la réinitialisation. Veuillez réessayer.");
        return EMPTY;
      })
    ).subscribe();
  }

  isValid(): boolean {
    const {password} = this.signUp;
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

}
