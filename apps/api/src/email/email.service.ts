import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, resetPasswordToken: string) {
    const url: string = `${process.env.FRONT_URL}/auth/reset-password/${resetPasswordToken}`;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation du mot de passe',
      template: './reset-password',
      context: {
        url: url,
      },
    });
  }

  async sendSignUpEmail(email: string, firstName: string, lastName: string) {
    const url: string = `${process.env.FRONT_URL}/auth/login`;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue chez Caniparadis',
      template: './signup-success',
      context: {
        url: url,
        firstName: firstName,
        lastName: lastName,
      },
    });
  }
}
