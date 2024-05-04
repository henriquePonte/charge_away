import {Local, LocalModel} from "../models/LocalModel";

export const create = async (local: Partial<Local>) => {
    return await LocalModel.create(local)
}
