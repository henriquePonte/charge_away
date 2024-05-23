import Router, {Response} from "express";
import LocalValidationSchema from "../schemas/local/LocalValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {Local, LocalModel} from "../models/LocalModel";
import {create} from "../services/LocalService";
import { findClosestLocations } from "../services/LocalService";


const router = Router();

/**
 * Route to fetch all locations.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - A list of all found locations or an error message in case of failure.
 */
router.get("/", (req, res) => {
    console.log(req.query);
    LocalModel.find()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error getting locations.");
        });
});

/**
 * Route to fetch all locations of a specific user.
 *
 * @param {Object} req - The HTTP request object containing the user ID.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - A list of all locations associated with the user or an error message in case of failure.
 */
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const locations = await LocalModel.find({ user: userId });
        res.json(locations);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error getting user's locations.");
    }
});

/**
 * Finds the closest locations to a specified latitude and longitude coordinates.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} long - The longitude coordinate.
 * @returns {Promise<Object[]>} - A Promise that resolves to an array of closest locations.
 * @throws {Error} - If there's an error while fetching the closest locations.
 */
router.get("/closest", async (req, res) => {
    const lat = parseFloat(req.query.lat as string);
    const long = parseFloat(req.query.long as string);

    if (isNaN(lat) || isNaN(long)) {
        return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
    }

    try {
        const closestLocations = await findClosestLocations(lat, long);
        res.json(closestLocations);
    } catch (error) {
        console.error("Error getting closest locations:", error);
        res.status(500).json({ error: "Error getting closest locations." });
    }
});


/**
 * Route to fetch a specific location by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The found location or an error message in case of failure.
 */
router.get("/:id", (req, res) => {
    const localId = req.params.id;

    LocalModel.findById(localId)
        .then(local => {
            if (!local) {
                return res.status(404).send("Local not found:");
            }
            res.send(local.toString());
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error getting local.");
        });
});

/**
 * Route to create a new location.
 *
 * @param {Object} req - The HTTP request object containing the data of the new location.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The created location if the request data is valid, or an array of validation errors if the request data is invalid.
 */
router.post("/", LocalValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        try {
            const newLocal = await create(matchedData(req) as Partial<Local>);

            return res.json(newLocal);
        } catch (error) {
            console.error("LocalController: Error creating new local:", error);
            return res.status(500).json({ error: "Error creating new local." });
        }
    } else {
        return res.status(400).json({ errors: result.array() });
    }
});

router.put("/:localId", async (req, res) => {
    const localId = req.params.localId;
    const updatedFields = req.body;

    try {
        const existingLocal = await LocalModel.findById(localId);
        if (!existingLocal) {
            return res.status(404).send("Local not found.");
        }

        Object.assign(existingLocal, updatedFields);

        await existingLocal.save();

        return res.json(existingLocal);
    } catch (error) {
        console.error("Error updating local:", error);
        return res.status(500).json({ error: "Error updating local." });
    }
});


/**
 * Route to delete a specific location by its ID.
 *
 * @param {Object} req - The HTTP request object containing the ID of the location to be deleted.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - A success message if the location is deleted successfully, or an error message if the location is not found or if there's an error during deletion.
 */
router.delete("/:id", (req, res) => {
    const localId = req.params.id;

    LocalModel.findByIdAndDelete(localId)
        .then(local => {
            if (!local) {
                return res.status(404).send("Local not found.");
            }
            res.send("Local deleted successfully.");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error deleting local.");
        });
});


export default router;
