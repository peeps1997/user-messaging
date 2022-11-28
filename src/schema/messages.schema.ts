import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.schema';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  timestamp: number;

  @Column()
  isSent: boolean;

  @ManyToOne(() => User)
  fromUser: User;

  @ManyToOne(() => User)
  toUser: User;
}
