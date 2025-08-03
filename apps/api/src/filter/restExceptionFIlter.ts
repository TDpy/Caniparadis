import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Sentry from '@sentry/node';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    Sentry.captureException(exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string[] | string = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      // Définition d’un type partiel attendu de l’objet renvoyé
      type ErrorResponseBody = {
        error?: string;
        message?: string[] | string;
        statusCode?: number;
      };

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const errorBody = res as ErrorResponseBody;
        if (errorBody.message) {
          message = errorBody.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      message: message,
    });
  }
}
