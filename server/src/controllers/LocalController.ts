import Router, {Response} from "express";
import LocalValidationSchema from "../schemas/local/LocalValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {Local} from "../models/LocalModel";
import {create} from "../services/LocalService";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.send("Getting locals!");
});

router.post("/", LocalValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<Local>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:local", (req, res) => {
    const local = req.params.local;
    res.send(`PUT ${local}`);
});

router.delete("/", (req, res) => {
    res.send("DELETE local!");
});

export default router;
