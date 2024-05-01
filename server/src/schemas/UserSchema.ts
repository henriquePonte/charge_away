import {Schema} from "mongoose";

export const UserSchema = new Schema({
    email: String,
    name: String,
    password: String,
    location: String,
    urlPhoto: String
});
