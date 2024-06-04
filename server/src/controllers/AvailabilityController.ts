import Router, {Response} from "express";
import AvailabilityValidationSchema from "../schemas/availability/AvailabilityValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {Availability, AvailabilityModel} from "../models/AvailabilityModel";
import {create} from "../services/AvailabilityService";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    AvailabilityModel.find()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error getting locations.");
        });
});
router.get("/:id", (req, res) => {
    const availabilityId = req.params.id;

    AvailabilityModel.findById(availabilityId)
        .then(availability => {
            if (!availability) {
                return res.status(404).send("Availability not found:");
            }
            res.send(availability.toString());
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error getting Availability.");
        });
});

router.get("/local/:id", (req, res) => {
    const localId = req.params.id;

    AvailabilityModel.find({local: localId})
        .then(availability => {
            if (!availability) {
                return res.status(404).send("Availability not found:");
            }
            res.send(availability.toString());
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error getting Availability.");
        });
});

router.post("/", AvailabilityValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        try {
            const newAvailability = await create(matchedData(req) as Partial<Availability>);

            return res.json(newAvailability);
        } catch (error) {
            console.error("AvailabilityController: Error creating new Availability:", error);
            return res.status(500).json({error: "Error creating new Availability."});
        }
    } else {
        return res.status(400).json({errors: result.array()});
    }
});

router.put("/:availabilityId", async (req, res) => {
    const availabilityId = req.params.availabilityId;
    const updatedFields = req.body;

    try {
        const existingAvailability = await AvailabilityModel.findById(availabilityId);
        if (!existingAvailability) {
            return res.status(404).send("Availability not found.");
        }

        Object.assign(existingAvailability, updatedFields);

        await existingAvailability.save();

        return res.json(existingAvailability);
    } catch (error) {
        console.error("Error updating Availability:", error);
        return res.status(500).json({error: "Error updating Availability."});
    }
});


router.delete("/:id", (req, res) => {
    const availabilityId = req.params.id;

    AvailabilityModel.findByIdAndDelete(availabilityId)
        .then(availability => {
            if (!availability) {
                return res.status(404).send("Availability not found.");
            }
            res.send("Availability deleted successfully.");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error deleting Availability.");
        });
});

export default router;
