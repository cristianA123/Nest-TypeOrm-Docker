import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Role, Source } from '.';
import { DateAt, Image } from '../common';

@Entity({ name: 'users' })
export class User extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 255,
    name: 'recovery_token',
    nullable: true,
  })
  recoveryToken: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 255,
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Source, (source) => source.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @OneToOne(() => Image, (image) => image.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
