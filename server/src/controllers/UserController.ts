import Router, {Request, Response} from "express";
import UserValidationSchema from "../schemas/user/UserValidationSchema";
import { matchedData, validationResult } from "express-validator";
import {create, loginUser, update, destroy} from "../services/UserService";
import {IUser, UserModel} from "../models/UserModel";
import {LoginValidationSchema} from "../schemas/user/LoginValidationSchema";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    UserModel.find().then(result => {
        res.send(result?.toString());
    }).catch(err => console.log(err));
});

router.get("/:username", (req, res) => {
    const username = req.params.username;
    UserModel.find({ name: new RegExp(`.*${username}.*`)}).then(result => {
        res.end(result?.toString());
    }).catch(err => console.log(err));
});

router.post("/", UserValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<IUser>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:id", UserValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await update(req.params.id, matchedData(req) as Partial<IUser>));
    }

    return res.status(400).json({errors: result.array()});
});

router.delete("/:id", (req, res) => {
    const id = req.params.id
    UserModel.findByIdAndDelete(id).then(result => {
        res.end(result?.toString())
    }).catch(err => console.log(err));
});

router.post("/login", LoginValidationSchema(), async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password);
        if (user) {
            return res.json(user);
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
