import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import {ReservationService} from "../reservation/reservation.service";


@Injectable()
export class ReservationOwnerOrAdminGuard implements CanActivate {
  constructor(private readonly reservationService: ReservationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const reservationId = +request.params.id;

    if (user.role === 'ADMIN') {
      return true;
    }

    const reservation = await this.reservationService.findOne(reservationId);

    if (reservation?.animal?.owner?.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
