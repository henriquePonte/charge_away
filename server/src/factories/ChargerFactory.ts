import { faker } from '@faker-js/faker';

export function generateCharger() {
    return {
        portType: faker.word.noun(),
        status: faker.word.noun(),
        costPerWatt: faker.word.noun(),
        local: '66565fcf2831b2225194dd8b'
    };
}
