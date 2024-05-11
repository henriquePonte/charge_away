import { checkSchema } from "express-validator";

const LocalValidationSchema = () => {
    return checkSchema({
        long: {
            notEmpty: true
        },
        lat: {
            notEmpty: true
        },
        type: {
          notEmpty: true
        },
        status: {
            notEmpty: true
        },
        urlPhoto: {
            notEmpty: true
        },
        user: {
            notEmpty: true
        }
    });
}

export default LocalValidationSchema;