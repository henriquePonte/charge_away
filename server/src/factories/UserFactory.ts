import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export function generateUser() {
    const password = bcrypt.hashSync(faker.word.words(),10);
    return {
        email: faker.word.noun() + "@gmail.com",
        name: faker.person.fullName(),
        password: password,
        localidade: faker.word.noun(),
        urlPhoto: faker.image.url()
    };
}
