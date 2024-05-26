import { IUser, UserModel } from "../models/UserModel";
import bcrypt from "bcrypt";
import {ICharger} from "../models/ChargerModel";

export const create = async (person: Partial<IUser>) => {
    if (!person.password) {
        throw new Error("Password is required");
    }
    const hashedPassword = await bcrypt.hash(person.password, 10);
    const user = {...person, password: hashedPassword};
    return await UserModel.create(user);
}

export const update = async (id: String, person: Partial<IUser>) => {
    return UserModel.findByIdAndUpdate(id, person);
}

export const destroy = async (id: String) => {
    return UserModel.findByIdAndDelete(id);
}

export const loginUser = async (email: string, password: string): Promise<Partial<IUser> | null> => {
    console.log("Attempting to login with email:", email);
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
        console.log("User not found");
        return null;
    }

    console.log("Hashed password from DB:", user.password);
    console.log("Provided password:", password);
    //const passwordMatch = await bcrypt.compare(password,user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", passwordMatch);

    if (passwordMatch) {
        console.log("User logged in successfully");
        return user as Partial<IUser>; // Passwords match, return user
    } else {
        console.log("Invalid password");
        return null; // Passwords do not match
    }
}