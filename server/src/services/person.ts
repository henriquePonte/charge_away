import { IPerson, PersonModel } from "../models/person";

export const create = async (person: Partial<IPerson>) => {
    return await PersonModel.create(person)
}