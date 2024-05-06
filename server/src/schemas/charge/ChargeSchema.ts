import {Schema} from "mongoose";

export const ChargeSchema = new Schema({
    date: Date,
    duration: Date,
    wattConsumed: Number,
    rate: Number,
    cost: Number,
    initialHour: Date,
    finalHour: Date
});


