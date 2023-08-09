import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

export class Status {
  @Exclude()
  @Column({
    name: 'status',
    type: 'boolean',
    default: true,
  })
  status: boolean;
}
