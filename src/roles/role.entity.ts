import { Association } from '../associations/association.entity.js';
import { User } from '../users/user.entity.js';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  idUser: number;

  @PrimaryColumn()
  idAssociation: number;

  @Column()
  name: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUser', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Association, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idAssociation', referencedColumnName: 'id' })
  association: Association;
}
