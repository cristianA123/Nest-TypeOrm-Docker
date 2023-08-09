import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { CityEnum } from '../../constants';
import { City, Country } from '../entities/hotels';

export default class CitySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositoryCities = dataSource.getRepository(City);
    const repositoryCountries = dataSource.getRepository(Country);

    const country = await repositoryCountries.findOne({
      where: { name: 'Peru' },
    });

    const cities = Object.values(CityEnum).map((city) => {
      const newCity = new City();
      newCity.name = city;
      newCity.country = country;
      return newCity;
    });

    await repositoryCities.insert(cities);
  }
}
