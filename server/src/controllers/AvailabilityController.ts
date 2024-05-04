import Router, {Response} from "express";
import AvailabilityValidationSchema from "../schemas/availability/AvailabilityValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {Availability} from "../models/AvailabilityModel";
import {create} from "../services/AvailabilityService";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.send("Getting Availabilities!");
});

router.post("/", AvailabilityValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<Availability>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:availability", (req, res) => {
    const availability = req.params.availability;
    res.send(`PUT ${availability}`);
});

router.delete("/", (req, res) => {
    res.send("DELETE Availability!");
});

export default router;
