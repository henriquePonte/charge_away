import { faker } from '@faker-js/faker';

export function generateCharge() {
    return {
        date: faker.date.recent(),
        duration: faker.date.recent(),
        wattConsumed: faker.number.int(),
        rate: faker.number.int({ min: 1, max: 5 }),
        cost: faker.number.int(),
        initialHour: faker.date.recent(),
        finalHour: faker.date.recent()
    };
}
