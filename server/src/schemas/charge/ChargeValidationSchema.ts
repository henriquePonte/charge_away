import { checkSchema } from "express-validator";

const ChargeValidationSchema = () => {
    return checkSchema({
        date: {
            notEmpty: true,
            isDate: {
                errorMessage: 'Invalid date'
            }
        },
        duration: {
            notEmpty: true,
            isDate: {
                errorMessage: 'Invalid duration'
            }
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
            isDate: {
                errorMessage: 'Invalid initial hour'
            }
        },
        finalHour: {
            notEmpty: true,
            isDate: {
                errorMessage: 'Invalid final hour'
            }
        }
    });
}

export default ChargeValidationSchema;
