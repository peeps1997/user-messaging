import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schema/users.schema';
import { Message } from './schema/messages.schema';
import { sqlConfig } from './config';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: sqlConfig.HOST,
      port: sqlConfig.PORT,
      username: sqlConfig.USERNAME,
      password: sqlConfig.PASSWORD,
      database: sqlConfig.DB,
      entities: [User, Message],
      synchronize: true,
    }),
    RabbitMqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
