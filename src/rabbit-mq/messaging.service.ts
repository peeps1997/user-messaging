import { RabbitRPC, Nack } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { rmqConfig } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../schema/users.schema';
import { Message } from '../schema/messages.schema';
import { Repository } from 'typeorm';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}
  @RabbitRPC({
    exchange: 'amq.direct',
    routingKey: rmqConfig.QUEUE_NAME,
    queue: rmqConfig.QUEUE_NAME,
  })
  public async rpcHandler(msg) {
    if (msg.data.text && !msg.data.isSent && msg.data.toUser.id) {
      this.usersRepository
        .findOneBy({ id: msg.data.toUser.id })
        .then((user: User) => {
          if (user !== null)
            if (user.id) {
              msg.data.isSent = true;
              this.messageRepository.save(msg.data).catch(() => {
                return new Nack(true);
              });
            }
        });
    } else {
      return new Nack();
    }
  }
}
