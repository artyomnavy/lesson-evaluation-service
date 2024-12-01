import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { initTestSettings } from './init-test-settings';
import { HttpStatuses } from '../src/common/utils';

describe('lesson-evaluation-service (e2e) testing', () => {
  let app: INestApplication;
  let server;

  let user1;
  let user2;

  let availableLesson1;
  let availableLesson2;

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
    const createData = {
      name: 1,
      email: 'test$test.com',
    };

    const createUser = await request(server)
      .post('/api/users')
      .send(createData)
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

  // Создание первого пользователя
  it('+ POST create user 1 with correct data', async () => {
    const createData = {
      name: 'John Doe',
      email: 'john@doe.com',
    };

    const createUser1 = await request(server)
      .post('/api/users')
      .send(createData)
      .expect(HttpStatuses.CREATED_201);

    expect(createUser1.body).toStrictEqual({
      id: expect.any(String),
      name: createData.name,
      email: createData.email,
    });

    user1 = createUser1.body;

    const foundUsers = await request(server)
      .get('/api/users')
      .expect(HttpStatuses.OK_200);

    expect(foundUsers.body).toStrictEqual([
      {
        id: expect.any(String),
        name: createData.name,
        email: createData.email,
      },
    ]);
  });

  // Создание второго пользователя
  it('+ POST create user 2 with correct data', async () => {
    const createData = {
      name: 'Adam Smith',
      email: 'adam@smith.com',
    };

    const createUser2 = await request(server)
      .post('/api/users')
      .send(createData)
      .expect(HttpStatuses.CREATED_201);

    expect(createUser2.body).toStrictEqual({
      id: expect.any(String),
      name: createData.name,
      email: createData.email,
    });

    user2 = createUser2.body;

    const foundUsers = await request(server)
      .get('/api/users')
      .expect(HttpStatuses.OK_200);

    expect(foundUsers.body).toStrictEqual([
      user1,
      {
        id: expect.any(String),
        name: createData.name,
        email: createData.email,
      },
    ]);
  });

  // Проверяем создание доступных уроков
  it('- POST available lesson with incorrect data', async () => {
    const createData = {
      name: true,
      code: 2,
    };

    const createAvailableLesson = await request(server)
      .post('/api/lessons/available')
      .send(createData)
      .expect(HttpStatuses.BAD_REQUEST_400);

    expect(createAvailableLesson.body).toStrictEqual({
      message: [expect.any(String), expect.any(String)],
      error: 'Bad Request',
      statusCode: HttpStatuses.BAD_REQUEST_400,
    });
  });

  // Создание первого доступного урока
  it('+ POST available lesson 1 with correct data', async () => {
    const createData = {
      name: 'Математика',
      code: 'math',
    };

    const createAvailableLesson1 = await request(server)
      .post('/api/lessons/available')
      .send(createData)
      .expect(HttpStatuses.CREATED_201);

    expect(createAvailableLesson1.body).toStrictEqual({
      id: expect.any(Number),
      name: createData.name,
      code: createData.code,
    });

    availableLesson1 = createAvailableLesson1.body;
  });

  // Создание первого доступного урока
  it('+ POST available lesson 2 with correct data', async () => {
    const createData = {
      name: 'Музыка',
      code: 'music',
    };

    const createAvailableLesson2 = await request(server)
      .post('/api/lessons/available')
      .send(createData)
      .expect(HttpStatuses.CREATED_201);

    expect(createAvailableLesson2.body).toStrictEqual({
      id: expect.any(Number),
      name: createData.name,
      code: createData.code,
    });

    availableLesson2 = createAvailableLesson2.body;
  });

  // Проверяем создание реальных уроков
  it('- POST active lesson with incorrect type userIds', async () => {
    const createData = {
      availableLessonName: 'Математика',
      userIds: 2,
    };

    const createActiveLesson = await request(server)
      .post('/api/lessons')
      .send(createData)
      .expect(HttpStatuses.BAD_REQUEST_400);

    expect(createActiveLesson.body).toStrictEqual({
      message: [expect.any(String)],
      error: 'Bad Request',
      statusCode: HttpStatuses.BAD_REQUEST_400,
    });
  });

  it('- POST active lesson with not exists userIds', async () => {
    const createData = {
      availableLessonName: 'Математика',
      userIds: ['-1'],
    };

    const createActiveLesson = await request(server)
      .post('/api/lessons')
      .send(createData)
      .expect(HttpStatuses.BAD_REQUEST_400);

    expect(createActiveLesson.body).toStrictEqual({
      message: [expect.any(String)],
      error: 'Bad Request',
      statusCode: HttpStatuses.BAD_REQUEST_400,
    });
  });

  it('- POST active lesson with incorrect availableLessonName', async () => {
    const createData = {
      availableLessonName: 'test',
      userIds: [user1.id, user2.id],
    };

    const createActiveLesson = await request(server)
      .post('/api/lessons')
      .send(createData)
      .expect(HttpStatuses.BAD_REQUEST_400);

    expect(createActiveLesson.body).toStrictEqual({
      message: [expect.any(String)],
      error: 'Bad Request',
      statusCode: HttpStatuses.BAD_REQUEST_400,
    });
  });

  afterAll(async () => {
    await request(server)
      .delete(`/api/testing/all-data`)
      .expect(HttpStatuses.OK_200);

    await server.close();
  });
});