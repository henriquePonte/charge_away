import Router, {Response} from "express";
import RoleValidationSchema from "../schemas/role/RoleValidationSchema";
import {matchedData, validationResult} from "express-validator";
import {IRole} from "../models/RoleModel";
import {create} from "../services/RoleService";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.send("Getting roles!");
});

router.post("/", RoleValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<IRole>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:role", (req, res) => {
    const role = req.params.role;
    res.send(`PUT ${role}`);
});

router.delete("/", (req, res) => {
    res.send("DELETE role!");
});

export default router;
