import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './app.settings';
import { swaggerSetup } from '../swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSettings(app);
  swaggerSetup(app);

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
