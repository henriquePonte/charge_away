import { faker } from '@faker-js/faker';

export function generateCharge() {
    return {
        date: faker.date.recent(),
        duration: faker.date.recent(),
        wattConsumed: faker.number,
        rate: faker.number,
        cost: faker.number,
        initialHour: faker.date.recent(),
        finalHour: faker.date.recent()
    };
}
