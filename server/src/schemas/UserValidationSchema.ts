import { checkSchema } from "express-validator";

const UserValidationSchema = () => {
    return checkSchema({
        email: {
            errorMessage: 'Invalid email',
            isEmail: true,
            notEmpty: true
        },
        name: {
            notEmpty: true
        },
        password: {
            notEmpty: true
        }
    });
}

export default UserValidationSchema;
