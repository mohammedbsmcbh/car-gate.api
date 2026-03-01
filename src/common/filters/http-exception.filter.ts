import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      errorCode:
        exception instanceof HttpException
          ? exception.name
          : 'INTERNAL_SERVER_ERROR',
    };

    // Log the error
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Exception: ${JSON.stringify(responseBody)}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`Exception: ${JSON.stringify(responseBody)}`);
    }

    // Hide internal details in production for 500 errors
    if (
      process.env.NODE_ENV === 'production' &&
      httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      responseBody.message = 'Internal server error';
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
