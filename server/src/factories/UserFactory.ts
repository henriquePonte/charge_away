import { faker } from '@faker-js/faker';

export function generateUser() {
    return {
        email: faker.word.noun() + "@gmail.com",
        name: faker.person.fullName(),
        password: faker.word.words(),
        localidade: faker.word.noun(),
        urlPhoto: faker.image.url()
    };
}
