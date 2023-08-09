import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DateAt } from '.';
import { User } from '../users';
import { Hotel, Quality, Room } from '../hotels';

@Entity({ name: 'images' })
export class Image extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  public_id: string;

  @Column({ type: 'varchar', length: 255 })
  secure_url: string;

  @OneToOne(() => User, (user) => user.image)
  user: User;

  @OneToOne(() => Quality, (quality) => quality.image)
  quality: Quality;

  @ManyToOne(() => Room, (room) => room.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Hotel, (hotel) => hotel.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;
}
