import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpStatuses } from '../utils';
import { Request, Response } from 'express';
import { ErrorsMessagesType } from '../types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (
      status === HttpStatuses.BAD_REQUEST_400 &&
      exception instanceof BadRequestException
    ) {
      const errorsResponse: ErrorsMessagesType = {
        errorsMessages: [],
      };

      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((e) =>
          errorsResponse.errorsMessages.push(e),
        );
      } else {
        errorsResponse.errorsMessages.push(responseBody);
      }

      response.status(status).json(errorsResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
