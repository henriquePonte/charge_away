import {UserModel} from "../models/UserModel";
import {generateUser} from "../factories/UserFactory";

export function seedUserDatabase() {
    const users = Array.from({ length: 10 }, generateUser);

    UserModel.insertMany(users)
        .then(() => console.log('UserSeeder: Data inserted successfully'))
        .catch(err => console.error('UserSeeder: Error entering data', err));
}
