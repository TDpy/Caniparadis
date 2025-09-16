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

  async sendReservationCreationToClientEmail(
    reservationId: number,
    email: string,
    firstName: string,
    lastName: string,
    date: string,
    animalName: string,
    serviceType: string,
  ) {
    const url: string = `${process.env.FRONT_URL}/reservation/${reservationId}`;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Votre réservation',
      template: './creation-to-client',
      context: {
        url: url,
        firstName: firstName,
        lastName: lastName,
        date: date,
        animalName: animalName,
        serviceType: serviceType,
      },
    });
  }

  async sendReservationRequestToAdminsEmail(
    reservationId: number,
    email: string,
    firstName: string,
    lastName: string,
    date: string,
    animalName: string,
    serviceType: string,
  ) {
    const url: string = `${process.env.FRONT_URL}/reservation/${reservationId}`;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Demande de réservation',
      template: './request-to-admin',
      context: {
        url: url,
        firstName: firstName,
        lastName: lastName,
        date: date,
        animalName: animalName,
        serviceType: serviceType,
      },
    });
  }

  async sendReservationAcceptedEmail(
    reservationId: number,
    email: string,
    firstName: string,
    lastName: string,
    date: string,
    animalName: string,
    serviceType: string,
  ) {
    const url = `${process.env.FRONT_URL}/reservation/${reservationId}`;
    return this.mailerService.sendMail({
      to: email,
      subject: 'Réservation confirmée',
      template: './accepted',
      context: { url, firstName, lastName, date, animalName, serviceType },
    });
  }

  // eslint-disable-next-line sonarjs/sonar-max-params
  async sendReservationProposedSlotEmail(
    reservationId: number,
    email: string,
    firstName: string,
    lastName: string,
    date: string,
    animalName: string,
    serviceType: string,
    comment?: string,
  ) {
    const url = `${process.env.FRONT_URL}/reservation/${reservationId}`;
    return this.mailerService.sendMail({
      to: email,
      subject: 'Nouvelle proposition de créneau',
      template: './proposed-slot',
      context: {
        url,
        firstName,
        lastName,
        date,
        animalName,
        serviceType,
        comment,
      },
    });
  }

  // eslint-disable-next-line sonarjs/sonar-max-params
  async sendReservationPaidEmail(
    reservationId: number,
    email: string,
    firstName: string,
    lastName: string,
    amountPaid: number,
    totalPrice: number,
    animalName: string,
    serviceType: string,
  ) {
    const url = `${process.env.FRONT_URL}/reservation/${reservationId}`;
    return this.mailerService.sendMail({
      to: email,
      subject: 'Paiement confirmé',
      template: './paid',
      context: {
        url,
        firstName,
        lastName,
        amountPaid,
        totalPrice,
        animalName,
        serviceType,
      },
    });
  }
}
