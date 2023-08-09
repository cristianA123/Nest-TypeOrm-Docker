import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { City } from '.';
import { DateAt, Image } from '../common';
import { Room } from './room.entity';

@Entity({ name: 'hotels' })
export class Hotel extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rating: string;

  @OneToOne(() => City, (city) => city.hotels, {
    nullable: true,
  })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Image, (image) => image.hotel, {
    nullable: true,
  })
  images: Image[];

  @OneToMany(() => Room, (room) => room.hotel, {
    nullable: true,
  })
  rooms: Room[];
}
