import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

import { Quality } from '../entities/hotels';
import { QualityEnum } from '../../constants/quality.model';
import { Image } from '../entities/common';

export default class QualitySeed implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositoryQualities = dataSource.getRepository(Quality);
    const repositoryImages = dataSource.getRepository(Image);

    const newImages = Object.values(QualityEnum).map((quality) => {
      const newImage = new Image();
      newImage.secure_url = faker.image.url({ width: 640, height: 480 });
      newImage.public_id = faker.string.uuid();
      newImage.name = faker.lorem.word({ strategy: 'longest' });
      return newImage;
    });

    await repositoryImages.insert(newImages);

    const images = await repositoryImages.find();

    const qualities = images.map((image, index) => {
      const newQuality = new Quality();
      newQuality.name = Object.values(QualityEnum)[index];
      newQuality.description = faker.lorem.sentence();
      newQuality.image = image;
      return newQuality;
    });

    await repositoryQualities.insert(qualities);
  }
}
