import Router, {Response} from "express";
import ChargerValidationSchema from "../schemas/charger/ChargerValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {ICharger} from "../models/ChargerModel";
import {create} from "../services/ChargeService";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.send("Getting chargers!");
});

router.post("/", ChargerValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<ICharger>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:charger", (req, res) => {
    const charger = req.params.charger;
    res.send(`PUT ${charger}`);
});

router.delete("/", (req, res) => {
    res.send("DELETE charger!");
});

export default router;
