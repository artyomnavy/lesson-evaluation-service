import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { HttpStatuses } from '../src/common/utils';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';
import { ErrorMessageType } from '../src/common/types';
import { HttpExceptionFilter } from '../src/common/exceptions/http.exception-filter';

export const initTestSettings = async (
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingModule = await testingModuleBuilder.compile();

  const app = testingModule.createNestApplication();

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

  await app.init();

  const server = app.getHttpServer();

  await request(server)
    .delete(`/api/testing/all-data`)
    .expect(HttpStatuses.NO_CONTENT_204);

  return {
    app,
    server,
  };
};
