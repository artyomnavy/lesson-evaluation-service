import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';
import { ErrorMessageType } from './common/types';
import { HttpExceptionFilter } from './common/exceptions/http.exception-filter';

export const appSettings = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsForResponse: ErrorMessageType[] = [];

        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints ?? {});

          constraintKeys.forEach((cKey) => {
            errorsForResponse.push({
              field: e.property,
              message: e.constraints?.[cKey] ?? '',
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
};
