import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

import { Role } from '../entities/users';
import { RoleEnum } from '../../constants/role.model';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositoryRoles = dataSource.getRepository(Role);

    const roles = Object.values(RoleEnum).map((role) => {
      const newRole = new Role();
      newRole.name = role;
      newRole.description = faker.lorem.sentence();
      return newRole;
    });

    await repositoryRoles.insert(roles);
  }
}
