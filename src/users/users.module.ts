import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../schema/users.schema';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { rmqConfig } from '../config';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';
import { Message } from 'src/schema/messages.schema';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message]), RabbitMqModule],
  providers: [
    UsersService,
    {
      provide: 'MESSAGING_SERVICE',
      useFactory: () => {
        const host = rmqConfig.HOST;
        const queueName = rmqConfig.QUEUE_NAME;
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
