import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Inject,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/schema/users.schema';
import { Message } from 'src/schema/messages.schema';
import { UsersService } from './users.service';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private userService: UsersService,
    @Inject('MESSAGING_SERVICE') private client: ClientProxy,
  ) {}

  @Get()
  index(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param() id): Promise<User> {
    return this.userService.findOne(id.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  async getUserEmail(@Param() email): Promise<User> {
    return this.userService.findOnebyEmail(email.email);
  }

  @Post('create')
  async create(@Body() userData: User): Promise<any> {
    return this.userService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/create-message')
  async createMsg(@Res() res: Response, @Param() id, @Body() message: Message) {
    this.userService.createMsg(id, message);
    return res.status(HttpStatus.OK).send({ deliveryStatus: 'success' });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get-message')
  async getMsg(@Param() id): Promise<any> {
    return this.userService.getMsg(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/sent-message')
  async sentMsg(@Param() id): Promise<any> {
    return this.userService.sentMsg(id);
  }
}
