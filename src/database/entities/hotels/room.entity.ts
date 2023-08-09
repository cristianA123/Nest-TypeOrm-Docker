import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DateAt, Image } from '../common';
import { Hotel, Quality, TypeRoom } from '.';

@Entity({ name: 'rooms' })
export class Room extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'boolean' })
  available: boolean;

  @ManyToOne(() => TypeRoom, (type) => type.rooms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'type_room_id' })
  type: TypeRoom;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @ManyToMany(() => Quality, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    // eager: true,
  })
  @JoinTable({
    name: 'rooms_qualities',
    joinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'quality_id',
      referencedColumnName: 'id',
    },
  })
  qualities: Quality[];

  @OneToMany(() => Image, (image) => image.room, {
    nullable: true,
  })
  images: Image[];
}
