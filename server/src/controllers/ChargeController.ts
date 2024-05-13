import Router, { Response } from "express";
import ChargeValidationSchema from "../schemas/charge/ChargeValidationSchema";
import { matchedData, validationResult } from "express-validator";
import {ICharge, ChargeModel} from "../models/ChargeModel";
import {create, update} from "../services/ChargeService";
import chargeValidationSchema from "../schemas/charge/ChargeValidationSchema";


const router = Router();
/**
 * Route get a charge
 */
router.get("/", (req, res) => {
    console.log(req.query);
    ChargeModel.find()
        .then(result => {
            res.send(result?.toString());
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error getting charge.");
        });
    res.send("Getting charge!");
});

/**
 * Route to create new Charge
 */
router.post("/", ChargeValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        try {
            const newCharge = await create(matchedData(req) as Partial<ICharge>);

            return res.json(newCharge);
        } catch (error) {
            console.error("ChargeController: Error creating new charge:", error);
            return res.status(500).json({ error: "Error creating new charge!" });
        }
    } else {
        return res.status(400).json({ errors: result.array() });
    }
});

/**
 * Route to delete a Charge
 */
router.delete("/:id", (req, res) => {
    const chargeId = req.params.id;

    ChargeModel.findByIdAndDelete(chargeId)
        .then(charge => {
            if (!charge) {
                return res.status(404).send("Charge not found.");
            }
            res.send("Charge deleted successfully.");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error deleting charge.");
        });
});

router.put("/:id", chargeValidationSchema(), async (req: any, res: Response) => {
    const chargeId = req.params.id;

    try {
        const updatedCharge = await update(chargeId, matchedData(req) as Partial<ICharge>);

        return res.json(updatedCharge);
    } catch (error) {
        console.error("ChargeController: Error updating charge:", error);
        return res.status(500).json({ error: "Error updating new charge!" });
    }
});

export default router;
