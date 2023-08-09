import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DateAt } from '../common';
import { User } from '.';
import { SourceEnum } from '../../../constants';

@Entity({ name: 'source' })
export class Source extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SourceEnum,
    default: SourceEnum.EMAIL,
    unique: true,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  description: string;

  @OneToOne(() => User, (user) => user.source, {
    nullable: true,
  })
  users: User[];
}
