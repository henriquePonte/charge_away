import Router, { Response } from "express";
import PersonValidationSchema from "./schemas/person";
import { matchedData, validationResult } from "express-validator";
import { create } from "../services/person";
import { IPerson } from "../models/person";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.json([{ firstName: "Vítor", lastName: "Sousa", username: "vhsousa" }]);
});

router.get("/:username", (req, res) => {
    const username = req.params.username;
    res.send(`GET ${username} person!`);
});

router.post("/", PersonValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<IPerson>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:username", (req, res) => {
    const username = req.params.username;
    res.send(`PUT ${username} person!`);
});

router.delete("/", (req, res) => {
    res.send("DELETE person!");
});

export default router;