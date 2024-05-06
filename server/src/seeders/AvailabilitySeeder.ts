import { AvailabilityModel } from '../models/AvailabilityModel';
import {generateAvailability} from "../factories/AvailabilityFactory";

export function seedAvailabilityDatabase() {
    const locals = Array.from({ length: 10 }, generateAvailability);

    AvailabilityModel.insertMany(locals)
        .then(() => console.log('AvailabilitySeeder: Data inserted successfully'))
        .catch(err => console.error('AvailabilitySeeder: Error entering data', err));
}
