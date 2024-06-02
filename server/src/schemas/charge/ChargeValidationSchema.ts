import {checkSchema} from "express-validator";

const ChargeValidationSchema = () => {
    return checkSchema({
        date: {
            notEmpty: true,
        },
        duration: {
            notEmpty: true,
        },
        wattConsumed: {
            notEmpty: true,
            isNumeric: {
                errorMessage: 'Watt consumed must be a number'
            }
        },
        rate: {
            notEmpty: true,
            isNumeric: {
                errorMessage: 'Rate must be a number'
            }
        },
        cost: {
            notEmpty: true,
            isNumeric: {
                errorMessage: 'Cost must be a number'
            }
        },
        initialHour: {
            notEmpty: true,
        },
        finalHour: {
            notEmpty: true,
        },
        local: {
            notEmpty: true,
        },
        user: {notEmpty: true}
    });
}

export default ChargeValidationSchema;
