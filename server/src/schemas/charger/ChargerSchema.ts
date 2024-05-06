import {Schema} from "mongoose";

export const ChargerSchema = new Schema({
    portType: String,
    status: String
});
