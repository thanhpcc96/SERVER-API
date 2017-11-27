import faker from 'faker';

import ClientModel from '../models/client.model';
import UserModel from '../models/user.model';

export async function clientSeed(count) {
  const clients = [];
  Array.from({ length: count || 10 }).map(() => {
    const fakeClient = {
      phone: faker.phone.phoneNumber(),
      info: {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        address: `${faker.address.country('VN')} `,
      },
      local: {
        email: faker.internet.email(),
        password: `123456!`,
      },
      status: 'ACTIVE',
    };
    return clients.push(fakeClient);
  });
  return await ClientModel.insertMany(clients);
}
export async function userSeed(role) {
  const user = [];
  Array.from({ length: 32 }).map(() => {
    const fakeClient = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password:' 1234567891!',
      info: {
        fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
        passportNumber: faker.random.uuid(),
        address: `${faker.address.country('VN')} `,
        phoneNumber:faker.phone.phoneNumber(),
        dateofbirth: faker.date.between('01/01/1990','28/12/1998') ,
        gender: "KHAC"
      },
      role : faker.random.number(4), // phu xe
      status: 'ACTIVE',
    };
    return user.push(fakeClient);
  });
  return await UserModel.insertMany(user);
}

export async function deleteAllClient() {
  try {
    return await ClientModel.remove();
  } catch (err) {
    return err;
  }
}
