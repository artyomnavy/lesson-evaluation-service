import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http.exception-filter';
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';
import { ErrorMessageType } from './common/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
