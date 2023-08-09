import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

import { Role, Source, User } from '../entities/users';
import { SourceEnum, RoleEnum } from '../../constants';
import { Image } from '../entities/common';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const sourceRepository = dataSource.getRepository(Source);
    const imageRepository = dataSource.getRepository(Image);

    const user = new User();

    user.birthdate = faker.date.past();
    user.email = 'c3m.software.solutions@gmail.com';
    user.firstName = 'C3M';
    user.lastName = 'Software Solutions';
    user.phone = faker.phone.number();
    user.password = await bcrypt.hash(
      'c3mSoftwareSolutions',
      Number(process.env.BYCRYPT_SALT),
    );

    user.role = await roleRepository.findOne({
      where: { name: RoleEnum.SUPER_ADMIN },
    });
    user.source = await sourceRepository.findOne({
      where: { name: SourceEnum.EMAIL },
    });

    const userExists = await userRepository.findOne({
      where: { email: user.email },
    });

    const defaultImage = await imageRepository.findOne({
      where: { name: 'default_user_image' },
    });

    user.image = defaultImage;

    if (!userExists) await userRepository.insert(user);

    const userFactory = factoryManager.get(User);

    await userFactory.saveMany(10, {
      role: await roleRepository.findOne({
        where: { name: RoleEnum.USER },
      }),
      source: await sourceRepository.findOne({
        where: { name: SourceEnum.EMAIL },
      }),
    });
  }
}
