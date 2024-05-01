import {checkSchema} from "express-validator";

const RoleValidationSchema = () => {
    return checkSchema({
        name: {
            notEmpty: true
        }
    });
}

export default RoleValidationSchema;
