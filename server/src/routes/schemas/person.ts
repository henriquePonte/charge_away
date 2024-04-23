import { checkSchema } from "express-validator";

const PersonValidationSchema = () => {
    return checkSchema({
        email: {
            errorMessage: 'Invalid email',
            isEmail: true,
            notEmpty: true
        },
        firstName: {
            notEmpty: true
        },
        lastName: {
            notEmpty: true
        },
        age: {
            isNumeric: true,
            isInt: true,
        },
    });
}

export default PersonValidationSchema;