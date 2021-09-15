import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { DatabaseModule } from '../../database/database.module';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  controllers: [AuthController],

  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'WALLET_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://fclxwhus:oq-2YmXcoc7YqS0rUVJ7EvO9dKD3Z7tm@codfish.rmq.cloudamqp.com/fclxwhus',
          ],
          queue: 'wallets',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
