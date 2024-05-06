import { ChargeModel } from '../models/ChargeModel';
import { generateCharge } from '../factories/ChargeFactory';

export function seedChargeDatabase() {
    const charges = Array.from({ length: 10 }, generateCharge);

    ChargeModel.insertMany(charges)
        .then(() => console.log('ChargeSeeder: Data inserted successfully'))
        .catch(err => console.error('ChargeSeeder: Error entering data', err));
}
