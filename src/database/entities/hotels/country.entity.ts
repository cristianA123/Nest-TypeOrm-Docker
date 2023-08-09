import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DateAt } from '../common';
import { City } from '.';

@Entity({ name: 'countries' })
export class Country extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => City, (city) => city.country, {
    nullable: true,
  })
  cities: City[];
}
