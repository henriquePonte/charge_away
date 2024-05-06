import { ChargerModel } from '../models/ChargerModel';
import { generateCharger } from '../factories/ChargerFactory';

export function seedChargerDatabase() {
    const chargers = Array.from({ length: 10 }, generateCharger);

    ChargerModel.insertMany(chargers)
        .then(() => console.log('ChargerSeeder: Data inserted successfully'))
        .catch(err => console.error('ChargerSeeder: Error entering data', err));
}
