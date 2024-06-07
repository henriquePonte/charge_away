import {checkSchema} from "express-validator";

const ChargeValidationSchema = () => {
    return checkSchema({
        initialHour: {
            notEmpty: true,
        },
        finalHour: {
            notEmpty: true,
        },
        charger: {
            notEmpty: true,
        },
        user: {notEmpty: true},
        status: {notEmpty: true}
    });
}

export default ChargeValidationSchema;
