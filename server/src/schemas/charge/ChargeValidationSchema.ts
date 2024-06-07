import {checkSchema} from "express-validator";

const ChargeValidationSchema = () => {
    return checkSchema({
        date: {
            notEmpty: true,
        },
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
