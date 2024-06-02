import { checkSchema } from "express-validator";

const ChargerValidationSchema = () => {
    return checkSchema({
        portType: {
            notEmpty: {
                errorMessage: 'Port type is required!'
            }
        },
        status: {
            notEmpty: {
                errorMessage: 'Status is required!'
            }
        },
        costPerWatt:{
            notEmpty: {errorMessage: 'Cost is required!'}
        },
        local:{
            notEmpty: {errorMessage: 'Local is required!'}
        }
    });
}

export default ChargerValidationSchema;
