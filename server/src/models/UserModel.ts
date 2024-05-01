import { Model, Schema, model } from "mongoose";
import {UserSchema} from "../schemas/user/UserSchema";

// Define a Mongoose model
export interface IUser extends Document {
    email: string,
    name: string,
    password: string,
    localidade: string,
    urlPhoto: string
}

export const UserModel = model<IUser>(
    "users",
    UserSchema
);

