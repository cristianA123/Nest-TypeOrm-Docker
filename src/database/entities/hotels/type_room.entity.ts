import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DateAt } from '../common';
import { Room } from '.';

@Entity({ name: 'type_room' })
export class TypeRoom extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => Room, (room) => room.type, {
    nullable: true,
  })
  rooms: Room[];
}
