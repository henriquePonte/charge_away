import express from "express";
import personRoutes from "./routes/person";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Configure environment variables
dotenv.config();

const { MONGO_URI } = process.env;

// Check if credentials are valid (exists)
if (!MONGO_URI) {
    console.error(`Invalid database URI: ${MONGO_URI}`);
    process.exit(-1);
}

// Configure database access
mongoose
    .connect(MONGO_URI)
    .then(_ => console.log("Connected to the database..."))
    .catch(e => {
        console.log(e);
        process.exit(-2);
    })

const app = express();

// Make express use middlewares
app.use(bodyParser.json());

// API Routes
app.use("/person", personRoutes);

// API Listen
app.listen(8000, () => {
    console.log("Server is listening at port 8000");
});