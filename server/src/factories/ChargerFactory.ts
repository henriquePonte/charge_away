import { faker } from '@faker-js/faker';

export function generateCharger() {
    return {
        portType: faker.word,
        status: faker.word
    };
}
