import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import validationOptions from './utils/types/validation.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);
  const host = configService.get<string>('SERVER_HOST');
  const port = configService.get<string>('SERVER_PORT');
  const env = configService.get<string>('SERVER_ENV');
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.enableShutdownHooks();
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders:
      'Origin,X-Requested-With,content-type,Accept,Authorization,x-access-token',
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const options = new DocumentBuilder()
    .setTitle('Klapil')
    .setDescription('Klapil Api Documentation')
    .setVersion('1')
    .addServer(`http://${host}:${port}`, env)
    .setExternalDoc('Get Postman Collection', 'api-docs-json')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, async () => {
    logger.log(`🚀 Server is running on: http://${host}:${port}/api`);
  });
}
bootstrap();
