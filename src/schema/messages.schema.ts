import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Long,
} from 'typeorm';
import { User } from './users.schema';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  timestamp: string;

  @Column()
  isSent: boolean;

  @ManyToOne(() => User)
  fromUser: User;

  @ManyToOne(() => User)
  toUser: User;
}
