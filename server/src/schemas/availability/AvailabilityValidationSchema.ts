import { checkSchema } from "express-validator";
import {AvailabilitySchema} from "./AvailabilitySchema";

const AvailabilityValidationSchema = () => {
    return checkSchema({
        start: {
            notEmpty: true
        },
        end: {
            notEmpty: true
        },
        local: {
            notEmpty: true
        }
    });
}

export default AvailabilityValidationSchema;