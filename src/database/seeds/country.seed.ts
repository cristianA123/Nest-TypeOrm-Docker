import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { CountryEnum } from '../../constants';
import { Country } from '../entities/hotels';

export default class CountrySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositoryCountries = dataSource.getRepository(Country);

    const countries = Object.values(CountryEnum).map((role) => {
      const newCountry = new Country();
      newCountry.name = role;
      return newCountry;
    });

    await repositoryCountries.insert(countries);
  }
}
