import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

import { Image } from '../entities/common';

export default class ImageSeed implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositoryImages = dataSource.getRepository(Image);

    const image = new Image();
    image.name = 'default_user_image';
    image.public_id = faker.string.uuid();
    image.secure_url = faker.image.avatar();

    await repositoryImages.insert(image);
  }
}
