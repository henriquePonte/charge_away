import { IUser, UserModel } from "../models/UserModel";

export const create = async (person: Partial<IUser>) => {
    return await UserModel.create(person)
}