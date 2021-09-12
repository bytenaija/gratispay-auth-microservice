import { NestFactory } from '@nestjs/core';
import { AppModule } from './service/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://fclxwhus:oq-2YmXcoc7YqS0rUVJ7EvO9dKD3Z7tm@codfish.rmq.cloudamqp.com/fclxwhus',
      ],
      queue: 'authentication',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
}

void bootstrap();
