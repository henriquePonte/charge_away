import { checkSchema } from "express-validator";

export const LoginValidationSchema = () => {
    return checkSchema({
        email: {
            errorMessage: 'Invalid email',
            isEmail: true,
            notEmpty: true
        },
        password: {
            notEmpty: true
        }
    });
}

