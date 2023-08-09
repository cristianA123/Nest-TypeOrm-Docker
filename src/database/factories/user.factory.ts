import { setSeederFactory } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/users';
import { PayloadToken } from './../../auth/interfaces/payload-token.interface';

export default setSeederFactory(User, async (faker) => {
  const user = new User();

  user.birthdate = faker.date.past();
  user.email = faker.internet.email();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.phone = faker.phone.number();
  user.password = await bcrypt.hash(
    user.email,
    Number(process.env.BYCRYPT_SALT),
  );

  return user;
});
