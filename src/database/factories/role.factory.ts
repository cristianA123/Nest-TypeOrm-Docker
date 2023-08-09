import { setSeederFactory } from 'typeorm-extension';

import { Role } from '../entities/users';
import { RoleEnum } from '../../constants/role.model';

export default setSeederFactory(Role, async (faker) => {
  const role = new Role();

  role.name = faker.helpers.arrayElement(Object.values(RoleEnum));
  role.description = faker.lorem.sentence();

  return role;
});
