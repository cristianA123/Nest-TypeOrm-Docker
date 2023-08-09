import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { User } from '.';
import { DateAt } from '../common';
import { RoleEnum } from '../../../constants';

@Entity({ name: 'roles' })
export class Role extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
