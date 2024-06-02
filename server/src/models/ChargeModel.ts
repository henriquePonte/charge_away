import {Schema, model, Document, Model} from "mongoose";
import {ChargeSchema} from "../schemas/charge/ChargeSchema";

// Define a Mongoose model
export interface ICharge extends Document {
    date: Date;
    duration: Date;
    wattConsumed: number;
    rate: number;
    cost: number;
    initialHour: Date;
    finalHour: Date;
    user: Schema.Types.ObjectId;
    local: Schema.Types.ObjectId;
}

export const ChargeModel: Model<ICharge> = model<ICharge>(
    "Charge",
    ChargeSchema
);
