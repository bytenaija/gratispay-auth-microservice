import { NestFactory } from '@nestjs/core';
import { AppModule } from './service/app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const server = express();
  server.set('etag', false);
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: true,
  });
  app.use(express.json({ limit: '50mb' }));

  const config = new DocumentBuilder()
    .setTitle('Give away')
    .setDescription('The give away API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3008);
}

void bootstrap();
