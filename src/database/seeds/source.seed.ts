import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

import { Source } from '../entities/users';
import { SourceEnum } from '../../constants';

export default class SourceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositorySource = dataSource.getRepository(Source);

    const sources = Object.values(SourceEnum).map((source) => {
      const newSource = new Source();
      newSource.name = source;
      newSource.description = faker.lorem.sentence();
      return newSource;
    });

    await repositorySource.insert(sources);
  }
}
