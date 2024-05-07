import { IUser, UserModel } from "../models/UserModel";

export const create = async (person: Partial<IUser>) => {
    return await UserModel.create(person)
}

export const loginUser = async (email: string, password: string): Promise<Partial<IUser> | null> => {
    // Use findOne with lean() to get a plain JavaScript object
    const user = await UserModel.findOne({ email, password }).lean();

    // If user is found, cast it to Partial<IUser>; otherwise, return null
    return user ? user as Partial<IUser> : null;
}