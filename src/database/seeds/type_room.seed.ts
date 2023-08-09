import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { TypeRoomEnum } from '../../constants';
import { TypeRoom } from '../entities/hotels';

export default class TypeRoomSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repositoryTypeRoom = dataSource.getRepository(TypeRoom);

    const typeRooms = Object.values(TypeRoomEnum).map((typeRoom) => {
      const newTypeRoom = new TypeRoom();
      newTypeRoom.name = typeRoom;
      newTypeRoom.description = typeRoom;
      return newTypeRoom;
    });

    await repositoryTypeRoom.insert(typeRooms);
  }
}
