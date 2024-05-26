import Router, {Response} from "express";
import ChargerValidationSchema from "../schemas/charger/ChargerValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {ICharger, ChargerModel} from "../models/ChargerModel";
import {create, destroyCharger, updateCharger} from "../services/ChargerService";
import {ChargeModel, ICharge} from "../models/ChargeModel";

const router = Router();

/**
 * Route get a Charger
 */
router.get("/", (req, res) => {
    ChargeModel.find().then(result => {
        res.send(result?.toString());
    }).catch(err => console.log(err));
});

/**
 * Route create a Charger
 */
router.post("/", ChargerValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<ICharger>));
    }

    return res.status(400).json({ errors: result.array() });
});

/**
 * Route do update a Charger
 */
router.put("/:charger", ChargerValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await updateCharger(req.params.charger, matchedData(req) as Partial<ICharger>));
    }

    return res.status(400).json({errors: result.array()});
});

router.delete("/:id", async (req, res) => {
    return res.json(await destroyCharger(req.params.id));
});


export default router;
