import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';

import RoleSeeder from './role.seed';
import SourceSeeder from './source.seed';
import CitySeeder from './city.seed';
import CountrySeeder from './country.seed';
import TypeRoomSeeder from './type_room.seed';
import QualitySeed from './quality.seed';
import ImageSeed from './image.seed';
import UserFactory from '../factories/user.factory';
import UserSeeder from './user.seed';

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [
        RoleSeeder,
        SourceSeeder,
        CountrySeeder,
        CitySeeder,
        TypeRoomSeeder,
        QualitySeed,
        ImageSeed,
        UserSeeder,
      ],
      factories: [UserFactory],
    });
  }
}
