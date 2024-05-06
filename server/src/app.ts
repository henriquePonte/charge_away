import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserController from "./controllers/UserController";
import RoleController from "./controllers/RoleController";
import LocalController from "./controllers/LocalController";
import AvailabilityController from "./controllers/AvailabilityController";
import SeederController from "./controllers/SeederController";


// Configure environment variables
dotenv.config();

const {MONGO_URI} = process.env;
const {Port} = process.env;


// Check if credentials are valid (exists)
if (!MONGO_URI) {
    console.error(`Invalid database URI: ${MONGO_URI}`);
    process.exit(-1);
}

// Configure database access
mongoose
    .connect(MONGO_URI)
    .then(_ => {
        console.log("Connected to the database!");
    })
    .catch(e => {
        console.log(e);
        process.exit(-2);
    })

const app = express();

// Make express use middlewares
app.use(bodyParser.json());

// API Routes
app.use("/users", UserController);
app.use("/roles", RoleController);
app.use("/locals", LocalController);
app.use("/Availabilities", AvailabilityController);
app.use("/seeder", SeederController)


// API Listen
app.listen(Port, () => {
    console.log(`Server is listening at port: ${Port}`);
});