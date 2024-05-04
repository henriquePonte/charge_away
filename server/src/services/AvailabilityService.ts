import {Availability, AvailabilityModel} from "../models/AvailabilityModel";

export const create = async (availability: Partial<Availability>) => {
    return await AvailabilityModel.create(availability)
}
