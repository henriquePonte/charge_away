import { faker } from '@faker-js/faker';

export function generateRole() {
    return {
        name: faker.word.noun(),
    };
}
