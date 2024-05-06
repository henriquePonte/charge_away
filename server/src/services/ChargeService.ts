import {ICharge, ChargeModel} from "../models/ChargeModel";

export const create = async (charge: Partial<ICharge>) => {
    return await ChargeModel.create(charge)
}

