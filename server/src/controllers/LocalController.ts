import Router, {Response} from "express";
import LocalValidationSchema from "../schemas/local/LocalValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {Local, LocalModel} from "../models/LocalModel";
import {create} from "../services/LocalService";
import {findClosestLocations} from "../services/LocalService";
import {upload} from "../services/MulterConfigService";
import path from "path";
import fs from "fs";
import {ParsedQs} from 'qs';


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

router.get("/search", (req, res) => {
    const searchQuery: string | ParsedQs | string[] | ParsedQs[] | undefined = req.query.query;

    if (!searchQuery || typeof searchQuery !== 'string') {
        return res.status(400).send("Query parameter is required and must be a string");
    }

    LocalModel.find({type: new RegExp(searchQuery, 'i')})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error getting locations.");
        });
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
        return res.status(400).json({error: 'Latitude and longitude must be valid numbers.'});
    }

    try {
        const closestLocations = await findClosestLocations(lat, long);

        const locationsWithImages = await Promise.all(closestLocations.map(async (local) => {
            if (!local || !local.urlPhoto) {
                return null;
            }

            const photoPath = String(local.urlPhoto);

            try {
                const data = await fs.promises.readFile(photoPath, {encoding: 'base64'});
                return {
                    ...local,
                    imageBase64: data
                };
            } catch (err) {
                console.error("Error reading image:", err);
                return {
                    ...local,
                    imageBase64: null
                };
            }
        }));

        const validLocations = locationsWithImages.filter(location => location !== null);
        res.json(validLocations);
    } catch (error) {
        console.error("Error getting closest locations:", error);
        res.status(500).json({error: "Error getting closest locations."});
    }
});
router.get("/:id/photo", async (req, res) => {
    const localId = req.params.id;

    try {
        const local = await LocalModel.findById(localId);

        if (!local) {
            return res.status(404).send("Local not found");
        }

        const photoPath = String(local.urlPhoto);

        fs.readFile(photoPath, {encoding: 'base64'}, (err, data) => {
            if (err) {
                console.error("Error reading image:", err);
                return res.status(500).send("Error reading image");
            }

            res.json({imageBase64: data});
        });
    } catch (error) {
        console.error("Error getting local:", error);
        res.status(500).send("Error getting local");
    }
});
/**
 * Route to fetch all locations of a specific user.
 *
 * @param {Object} req - The HTTP request object containing the user ID.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - A list of all locations associated with the user or an error message in case of failure.
 */
router.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const locations = await LocalModel.find({user: userId});
        res.json(locations);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error getting user's locations.");
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

            const photoPath = String(local.urlPhoto);
            console.log(photoPath);

            fs.readFile(photoPath, {encoding: 'base64'}, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error reading image.");
                }

                const localWithImage = {
                    ...local.toObject(),
                    imageBase64: data
                };

                res.json(localWithImage);
            });
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
router.post("/", upload.single('imageData'), LocalValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        try {
            const data = matchedData(req) as Partial<Local>;
            if (req.file) {
                data.urlPhoto = path.relative(process.cwd(), req.file.path);
                console.log("File saved to:", req.file.path);
            } else {
                console.log("No file uploaded");
            }

            const newLocal = await create(data);
            return res.status(201).json(newLocal);

        } catch (error: any) {
            console.error("LocalController: Error creating new local:", error);
            return res.status(500).json({error: error.message});
        }
    } else {
        return res.status(400).json({errors: result.array()});
    }
});

router.put("/:id", upload.single('imageData'), LocalValidationSchema(), async (req: any, res: Response) => {
    const localId = req.params.id;
    const result = validationResult(req);

    if (!result.isEmpty()) {
        console.log("Validation errors:", result.array());
        return res.status(400).json({ errors: result.array() });
    }

    try {
        const data = matchedData(req) as Partial<Local>;
        if (req.file) {
            data.urlPhoto = path.relative(process.cwd(), req.file.path);
            console.log("File saved to:", req.file.path);
        } else {
            console.log("No file uploaded");
        }

        const updatedLocal = await LocalModel.findByIdAndUpdate(localId, data, { new: true });

        if (!updatedLocal) {
            return res.status(404).send("Local not found.");
        }

        return res.status(200).json(updatedLocal);

    } catch (error: any) {
        console.error("Error updating local:", error.message);
        return res.status(500).json({ error: error.message });
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
