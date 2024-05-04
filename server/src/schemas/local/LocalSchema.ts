import {Schema} from "mongoose";

export const LocalSchema = new Schema({
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
});
