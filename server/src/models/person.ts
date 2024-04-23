import { Model, Schema, model } from "mongoose";

// Define a Mongoose model
export interface IPerson extends Document {
    email: string,
    firstName: string,
    lastName: string,
    age: number
}

const PersonSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    age: Number
});

export const PersonModel = model<IPerson>(
    "persons",
    PersonSchema
);

