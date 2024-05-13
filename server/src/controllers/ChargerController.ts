import Router, {Response} from "express";
import ChargerValidationSchema from "../schemas/charger/ChargerValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {ICharger, ChargerModel} from "../models/ChargerModel";
import {create} from "../services/ChargeService";
import {ChargeModel} from "../models/ChargeModel";

const router = Router();

/**
 * Route get a Charger
 */
router.get("/", (req, res) => {
    ChargeModel.find().then(result => {
        res.send(result?.toString());
    }).catch(err => console.log(err));
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
