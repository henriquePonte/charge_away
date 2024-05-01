import {IRole, RoleModel} from "../models/RoleModel";

export const create = async (role: Partial<IRole>) => {
    return await RoleModel.create(role)
}
