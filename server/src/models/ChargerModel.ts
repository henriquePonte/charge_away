import { Model, Schema, model } from "mongoose";
import {ChargerSchema} from "../schemas/charger/ChargerSchema";

// Define a Mongoose model
export interface ICharger extends Document {
    portType: string,
    status: string
}

export const ChargerModel = model<ICharger>(
    "chargers",
    ChargerSchema
);

