import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../schema/users.schema';
import { hashPassword } from '../utils/hasher.util';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from 'src/schema/messages.schema';
import { currentEpoch } from 'src/utils/epoch.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @Inject('MESSAGING_SERVICE') public client: ClientProxy,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOnebyEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async createMsg(userId, message) {
    const fromUser = { id: +userId.id };
    message.timestamp = currentEpoch();
    message.fromUser = fromUser;
    message.isSent = true;
    this.client
      .send(
        {
          cmd: 'message',
        },
        message,
      )
      .subscribe();
  }

  async create(user: User): Promise<User> {
    user.password = await hashPassword(user.password);
    return await this.usersRepository
      .save(user)
      .then(async (res) => {
        return res;
      })
      .catch((err) => {
        throw new BadRequestException(err.sqlMessage);
      });
  }

  async getMsg(userId: User) {
    const user = { id: +userId.id };
    return this.messageRepository.find({ where: { toUser: user } });
  }

  async sentMsg(userId: User) {
    const user = { id: +userId.id };
    return this.messageRepository.find({ where: { fromUser: user } });
  }
}
