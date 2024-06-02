import {Schema} from "mongoose";

export const ChargerSchema = new Schema({
    portType: String,
    status: String,
    costPerWatt: Number,
    local: {
        type: Schema.Types.ObjectId,
        ref: 'locals'
    }
});
