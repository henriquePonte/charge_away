import { Document, Schema, Model, model } from "mongoose";
import { UserSchema } from "../schemas/user/UserSchema";

export interface IUser extends Document {
    _id: string;
    email: string;
    name: string;
    password: string;
    localidade: string;
    urlPhoto: string;
}

export const UserModel: Model<IUser> = model<IUser>("users", UserSchema);
