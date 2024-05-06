import {ICharger, ChargerModel} from "../models/ChargerModel";

export const create = async (charger: Partial<ICharger>) => {
    return await ChargerModel.create(charger)
}
