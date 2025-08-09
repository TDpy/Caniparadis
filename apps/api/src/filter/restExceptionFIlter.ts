import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Sentry from '@sentry/node';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    Sentry.captureException(exception);

    this.logger.error(
      exception instanceof Error
        ? exception.message
        : JSON.stringify(exception),
      exception instanceof Error ? exception.stack : undefined,
    );

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string[] | string = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

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
