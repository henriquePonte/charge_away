import { faker } from '@faker-js/faker';

export function generateAvailability() {
    return {
        start: faker.date.future(),
        end: faker.date.future(),
        local: '60d6c7e4873e3c6faaddd123'
    };
}
