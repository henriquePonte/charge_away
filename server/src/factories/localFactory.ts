import { faker } from '@faker-js/faker';

export function generateLocal() {
    return {
        long: faker.location.longitude(),
        lat: faker.location.latitude(),
        type: faker.lorem.word(),
        rate: faker.number.int({ min: 1, max: 5 }),
        status: faker.lorem.word(),
        urlPhoto: faker.image.url(),
        user: '60d6c7e4873e3c6faaddd123'
    };
}
