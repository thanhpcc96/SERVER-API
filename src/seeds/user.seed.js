import faker from 'faker';

import ClientModel from '../models/client.model';

export async function clientSeed(count) {
    const clients=[];
    Array.from({length: count || 10}).map(()=>{
       const fakeClient= {
        phone: faker.phone.phoneNumber(),
        info:{
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            address: `${faker.address.country('VN')} `,
        },
        local:{
            email: faker.internet.email(),
            password:`123456!`,
        },
        status:'ACTIVE'
       }
       return clients.push(fakeClient);
    });
    return await ClientModel.insertMany(clients);
    
}