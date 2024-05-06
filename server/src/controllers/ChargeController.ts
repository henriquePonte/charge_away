import Router, {Response} from "express";
import ChargeValidationSchema from "../schemas/charge/ChargeValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {ICharge} from "../models/ChargeModel";
import {create} from "../services/ChargeService";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.send("Getting charges!");
});

router.post("/", ChargeValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<ICharge>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:charge", (req, res) => {
    const charge = req.params.charge;
    res.send(`PUT ${charge}`);
});

router.delete("/", (req, res) => {
    res.send("DELETE charge!");
});

export default router;
