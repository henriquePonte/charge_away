import Router from "express";
import {seedLocalDatabase} from "../seeders/localSeeder";
import {seedAvailabilityDatabase} from "../seeders/AvailabilitySeeder";
import {seedUserDatabase} from "../seeders/UserSeeder";
import {seedRoleDatabase} from "../seeders/RoleSeeder";
import {seedChargeDatabase} from "../seeders/ChargeSeeder";
import {seedChargerDatabase} from "../seeders/ChargerSeeder";

const router = Router();

router.get("/", (req, res) => {
    console.log(req.query);
    seedLocalDatabase();
    seedAvailabilityDatabase();
    seedUserDatabase();
    seedRoleDatabase();
    seedChargeDatabase();
    seedChargerDatabase();
    res.send("Seeding DB!")
});

export default router;
