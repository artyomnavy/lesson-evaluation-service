import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { HttpStatuses } from '../src/common/utils';
import { ValidationPipe } from '@nestjs/common';

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
    }),
  );

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
