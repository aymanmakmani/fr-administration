import {
  JoinTable,
  ManyToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';

@Entity()
export class Association {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  users: User[];

  
}
