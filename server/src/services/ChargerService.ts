import {ICharger, ChargerModel} from "../models/ChargerModel";

export const create = async (charger: Partial<ICharger>) => {
    return await ChargerModel.create(charger)
}
export const updateCharger = async (id: string, charger: Partial<ICharger>) => {
    return ChargerModel.updateOne({_id: id}, charger);
}

export const destroyCharger = async (id: string) => {
    return ChargerModel.deleteOne({_id: id});
}
