import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, resetPasswordToken: string) {
    const url: string = `${process.env.FRONT_URL}/reset-password/${resetPasswordToken}`;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation du mot de passe',
      template: './reset-password',
      context: {
        url: url,
      },
    });
  }
}
