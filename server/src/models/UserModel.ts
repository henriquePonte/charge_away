import { Model, Schema, model } from "mongoose";

// Define a Mongoose model
export interface IUser extends Document {
    email: string,
    name: string,
    password: string,
    localidade: string,
    urlPhoto: string
}

const UserSchema = new Schema({
    email: String,
    name: String,
    password: String,
    location: String,
    urlPhoto: String
});

export const UserModel = model<IUser>(
    "users",
    UserSchema
);

