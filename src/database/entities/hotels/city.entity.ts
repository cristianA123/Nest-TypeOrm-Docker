import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { DateAt } from '../common';
import { Country, Hotel } from '.';

import { CityEnum } from '../../../constants';

@Entity({ name: 'cities' })
export class City extends DateAt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CityEnum,
    default: CityEnum.LIMA,
  })
  name: string;

  @ManyToOne(() => Country, (country) => country.cities, {
    nullable: true,
  })
  // @JoinColumn({ name: 'country_id' })
  @JoinColumn()
  country: Country;

  @OneToMany(() => Hotel, (hotel) => hotel.city, {
    nullable: true,
  })
  hotels: Hotel[];
}
