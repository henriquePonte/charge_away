import Router, { Response } from "express";
import {seedLocalDatabase} from "../seeders/localSeeder";
import {seedAvailabilityDatabase} from "../seeders/AvailabilitySeeder";
import {seedUserDatabase} from "../seeders/UserSeeder";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    seedLocalDatabase();
    seedAvailabilityDatabase();
    seedUserDatabase();
});

export default router;
