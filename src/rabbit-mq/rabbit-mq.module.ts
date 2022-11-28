import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessagingService } from './Messaging.service';
import { Message } from 'src/schema/messages.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/schema/users.schema';
import { rmqConfig } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: rmqConfig.EXCHANGE_NAME,
          type: rmqConfig.EXCHANGE_TYPE,
        },
      ],
      uri: `amqp://${rmqConfig.HOST}`,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [MessagingService],
})
export class RabbitMqModule {}
