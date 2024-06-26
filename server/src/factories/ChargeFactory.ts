import { faker } from '@faker-js/faker';

export function generateCharge() {
    return {
        date: faker.date.recent(),
        duration: faker.date.recent(),
        wattConsumed: faker.number.int(),
        rate: faker.number.int({ min: 1, max: 5 }),
        cost: faker.number.int(),
        initialHour: faker.date.recent(),
        finalHour: faker.date.recent(),
        user: "665352a2dc9ce9c438d51e54",
        charger: "665ce760b68113f44aa91dfc",
        status: faker.lorem.word()
    };
}
