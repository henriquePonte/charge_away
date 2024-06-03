import {Schema} from "mongoose";

export const ChargeSchema = new Schema({
    date: Date,
    duration: Date,
    wattConsumed: Number,
    rate: Number,
    cost: Number,
    initialHour: Date,
    finalHour: Date,
    status: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    local: {
        type: Schema.Types.ObjectId,
        ref: 'locals'
    }
});


