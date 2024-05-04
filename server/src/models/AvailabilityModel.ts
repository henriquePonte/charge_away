import {model, Schema} from "mongoose";
import {AvailabilitySchema} from "../schemas/availability/AvailabilitySchema";

// Define a Mongoose model
export interface Availability extends Document {
    start: Date,
    end: Date,
    local: {
        type: Schema.Types.ObjectId,
        ref: 'Locals'
    }
}

export const AvailabilityModel = model<Availability>(
    "Availabilities",
    AvailabilitySchema
);
