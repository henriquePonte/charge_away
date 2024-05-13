import {ICharge, ChargeModel} from "../models/ChargeModel";

export const create = async (charge: Partial<ICharge>) => {
    return await ChargeModel.create(charge)
}

export const update = async (id:string, charge: Partial<ICharge>) => {
    return ChargeModel.findByIdAndUpdate(id, charge)
}

