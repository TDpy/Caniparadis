import {Component, inject} from '@angular/core';
import {LoginSignup} from '../../../components/login-signup/login-signup';
import {EmailDto} from '@caniparadis/dtos/dist/authDto';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [
    LoginSignup,
    FormsModule,
    CommonModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email: EmailDto = new EmailDto();
  formSubmitted: boolean = false;
  errorMessage: string = '';
  private authService = inject(AuthService);

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (!this.isValid()) return;

    const dto: EmailDto = {
      email: this.email.email,
    };

    this.authService.forgotPassword(dto).subscribe((success) => {

    });
  }

  isValid(): boolean {
    const {email} = this.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!email) {
      this.errorMessage = 'Tous les champs sont requis.';
      return false;
    }

    if (!emailRegex.test(email)) {
      this.errorMessage = 'Email invalide.';
      return false;
    }

    return true;
  }

}
