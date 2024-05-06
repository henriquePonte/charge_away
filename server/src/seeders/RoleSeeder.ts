import {generateRole} from "../factories/RoleFactory";
import {RoleModel} from "../models/RoleModel";

export function seedRoleDatabase() {
    const roles = Array.from({ length: 10 }, generateRole);

    RoleModel.insertMany(roles)
        .then(() => console.log('RoleSeeder: Data inserted successfully'))
        .catch(err => console.error('RoleSeeder: Error entering data', err));
}
