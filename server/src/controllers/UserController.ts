import Router, { Response } from "express";
import UserValidationSchema from "../schemas/user/UserValidationSchema";
import { matchedData, validationResult } from "express-validator";
import { create } from "../services/UserService";
import { IUser } from "../models/UserModel";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.json([{ firstName: "Vítor", lastName: "Sousa", username: "vhsousa" }]);
});

router.get("/:username", (req, res) => {
    const username = req.params.username;
    res.send(`GET ${username} person!`);
});

router.post("/", UserValidationSchema(), async (req: any, res: Response) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return res.json(await create(matchedData(req) as Partial<IUser>));
    }

    return res.status(400).json({ errors: result.array() });
});

router.put("/:username", (req, res) => {
    const username = req.params.username;
    res.send(`PUT ${username} person!`);
});

<<<<<<< Updated upstream
router.delete("/", (req, res) => {
    res.send("DELETE person!");
=======
router.delete("/:id", (req, res) => {
    const id = req.params.id
    UserModel.findByIdAndDelete(id).then(result => {
        res.end(result?.toString())
    }).catch(err => console.log(err));
});

router.post("/login", LoginValidationSchema(), async (req: Request, res: Response) => {
    console.log(req.body);
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
>>>>>>> Stashed changes
});

router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { email, name, localidade, urlPhoto } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { email, name, localidade, urlPhoto }, { new: true });

        if (updatedUser) {
            return res.json(updatedUser);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default router;
