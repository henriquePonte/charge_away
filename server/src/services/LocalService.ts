import {Local, LocalModel} from "../models/LocalModel";

export const create = async (local: Partial<Local>) => {
    return await LocalModel.create(local)
}
/**
 * Calculates the Euclidean distance between two locations specified by their latitude and longitude coordinates.
 *
 * @param {Object} location1 - The first location with latitude and longitude coordinates.
 * @param {number} location1.lat - The latitude coordinate of the first location.
 * @param {number} location1.long - The longitude coordinate of the first location.
 * @param {Object} location2 - The second location with latitude and longitude coordinates.
 * @param {number} location2.lat - The latitude coordinate of the second location.
 * @param {number} location2.long - The longitude coordinate of the second location.
 * @returns {number} - The Euclidean distance between the two locations.
 */
export function calculateDistance(location1: { lat: number; long: number }, location2: { lat: number; long: number }): number {
    const latDiff = location1.lat - location2.lat;
    const longDiff = location1.long - location2.long;
    return Math.sqrt(latDiff * latDiff + longDiff * longDiff);
}

/**
 * Finds the closest locations to the specified latitude and longitude.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} long - The longitude coordinate.
 * @returns {Promise<Object[]>} - An array containing the closest locations with their distances.
 * @throws {Error} - If there is an error while retrieving the closest locations.
 */
export async function findClosestLocations(lat: number, long: number) {
    const userLocation = { lat, long };

    try {
        const allLocations = await LocalModel.find();

        const locationsWithDistance = allLocations.map(local => {
            const localLat = parseFloat(String(local.lat));
            const localLong = parseFloat(String(local.long));

            if (isNaN(localLat) || isNaN(localLong)) {
                console.error(`Invalid latitude or longitude for location ${local._id}`);
                return null;
            }

            const distance = calculateDistance(userLocation, { lat: localLat, long: localLong });
            return { ...local.toObject(), distance };
        }).filter(Boolean);

        locationsWithDistance.sort((a, b) => {
            if (a && b) {
                return a.distance - b.distance;
            } else {
                return 0;
            }
        });

        return locationsWithDistance.slice(0, 5);
    } catch (error) {
        console.error("Error getting closest locations:", error);
        throw new Error("Error getting closest locations.");
    }
}
