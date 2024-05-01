import {model} from "mongoose";
import {RoleSchema} from "../schemas/role/RoleSchema";

// Define a Mongoose model
export interface IRole extends Document {
    name: string
}

export const RoleModel = model<IRole>(
    "roles",
    RoleSchema
);

