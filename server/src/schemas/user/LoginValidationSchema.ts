import { checkSchema } from "express-validator";

export const LoginValidationSchema = () => {
    return checkSchema({
        email: {
            errorMessage: 'Invalid email',
            isEmail: true,
            notEmpty: true
        },
        password: {
            notEmpty: true,
            isLength: {
                options: { min: 6, max: 20 },
                errorMessage: 'Password must be between 6 and 20 characters long'
            }
        }
    });
}

