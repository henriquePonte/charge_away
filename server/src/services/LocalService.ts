import {Local, LocalModel} from "../models/LocalModel";

export const create = async (local: Partial<Local>) => {
    return await LocalModel.create(local)
}
/**
 * Calculates the distance between two geographical points using the Haversine formula.
 *
 * @param {Object} point1 - The first point with latitude and longitude.
 * @param {Object} point2 - The second point with latitude and longitude.
 * @returns {number} - The distance between the two points in kilometers.
 */
export function calculateDistance(point1: { lat: number, long: number }, point2: { lat: number, long: number }): number {
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLong = (point2.long - point1.long) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * Finds the closest locations to the specified latitude and longitude.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} long - The longitude coordinate.
 * @returns {Promise<Object[]>} - An array containing the closest locations within a 50 km radius with their distances.
 * @throws {Error} - If there is an error while retrieving the closest locations.
 */
export async function findClosestLocations(lat: number, long: number) {
    const userLocation = { lat, long };
    const radiusInKm = 100;

    try {
        const allLocations = await LocalModel.find();

        const locationsWithinRadius = allLocations.map(local => {
            const localLat = parseFloat(String(local.lat));
            const localLong = parseFloat(String(local.long));

            if (isNaN(localLat) || isNaN(localLong)) {
                console.error(`Invalid latitude or longitude for location ${local._id}`);
                return null;
            }

            const distance = calculateDistance(userLocation, { lat: localLat, long: localLong });

            if (distance <= radiusInKm) {
                return { ...local.toObject(), distance };
            } else {
                return null;
            }
        }).filter(Boolean);

        locationsWithinRadius.sort((a, b) => {
            if (a && b) {
                return a.distance - b.distance;
            } else {
                return 0;
            }
        });

        return locationsWithinRadius;
    } catch (error) {
        console.error("Error getting closest locations:", error);
        throw new Error("Error getting closest locations.");
    }
}

