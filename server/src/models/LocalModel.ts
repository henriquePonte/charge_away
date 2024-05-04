import {model, Schema} from "mongoose";
import {LocalSchema} from "../schemas/local/LocalSchema";

// Define a Mongoose model
export interface Local extends Document {
    long: String,
    lat: String,
    type: String,
    rate: Number,
    status: String,
    urlPhoto: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}

export const LocalModel = model<Local>(
    "Locals",
    LocalSchema
);
