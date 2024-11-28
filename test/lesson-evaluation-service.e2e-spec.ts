import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { initTestSettings } from './init-test-settings';
import { HttpStatuses } from '../src/common/utils';

describe('lesson-evaluation-service (e2e) testing', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const testSettings = await initTestSettings();

    app = testSettings.app;
    server = testSettings.server;
  });

  // Проверяем получение всех пользователей
  it('+ GET all users', async () => {
    const foundUsers = await request(server)
      .get('/api/users')
      .expect(HttpStatuses.OK_200);

    expect(foundUsers.body).toStrictEqual([]);
  });

  // Проверяем создание пользователей
  it('- POST create user with incorrect data', async () => {
    const createDate = {
      name: 1,
      email: 'test$test.com',
    };

    const createUser = await request(server)
      .post('/api/users')
      .send(createDate)
      .expect(HttpStatuses.BAD_REQUEST_400);

    expect(createUser.body).toStrictEqual({
      message: [expect.any(String), expect.any(String)],
      error: 'Bad Request',
      statusCode: HttpStatuses.BAD_REQUEST_400,
    });

    const foundUsers = await request(server)
      .get('/api/users')
      .expect(HttpStatuses.OK_200);

    expect(foundUsers.body).toStrictEqual([]);
  });

  afterAll(async () => {
    await request(server)
      .delete(`/api/testing/all-data`)
      .expect(HttpStatuses.OK_200);

    await server.close();
  });
});
