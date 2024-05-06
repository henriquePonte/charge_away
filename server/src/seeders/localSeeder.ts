import { LocalModel } from '../models/LocalModel';
import { generateLocal } from '../factories/localFactory';

export function seedLocalDatabase() {
    const locals = Array.from({ length: 10 }, generateLocal);

    LocalModel.insertMany(locals)
        .then(() => console.log('LocalSeeder: Data inserted successfully'))
        .catch(err => console.error('LocalSeeder: Error entering data', err));
}
