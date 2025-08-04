import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CHECK_USER_PARAM_ID } from '../decorators/userId.decorator';

@Injectable()
export class CheckUserParamIdGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const paramName = this.reflector.get<string>(
      CHECK_USER_PARAM_ID,
      context.getHandler(),
    );

    if (!paramName) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === 'ADMIN') {
      return true;
    }

    let paramValue: string;
    paramValue = request.params[paramName];

    if (!paramValue) {
      paramValue = request.body[paramName];
    }

    if (!paramValue) {
      throw new ForbiddenException(
        `Missing parameter "${paramName}" in request`,
      );
    }

    if (String(user.id) !== String(paramValue)) {
      throw new ForbiddenException('Access denied: user ID mismatch');
    }

    return true;
  }
}
