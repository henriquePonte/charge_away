import {Schema} from "mongoose";
import bcrypt from "bcrypt";

export const UserSchema = new Schema({
    email: String,
    name: String,
    password: String,
    location: String,
    urlPhoto: String
});

UserSchema.pre("save", async function (next){
    const user: any = this;
    if (!user.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error: any) {
        return next(error);
    }
});
