import { Model, Schema, model } from "mongoose";
import {ChargeSchema} from "../schemas/charge/ChargeSchema";

// Define a Mongoose model
export interface ICharge extends Document {
    date: Date,
    duration: Date,
    wattConsumed: Number,
    rate: Number,
    cost: Number,
    initialHour: Date,
    finalHour: Date
}

export const ChargeModel = model<ICharge>(
    "charges",
    ChargeSchema
);

