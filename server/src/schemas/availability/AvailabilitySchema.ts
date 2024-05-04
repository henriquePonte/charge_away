import {Schema} from "mongoose";

export const AvailabilitySchema = new Schema({
    start: Date,
    end: Date,
    local: {
        type: Schema.Types.ObjectId,
        ref: 'Locals'
    }
});
