import express from "express";
import { mongoConnect } from "./src/dbconfig/mongoConfig.js";

const app = express();

// connect to mongoDB
mongoConnect();

const PORT = process.env.PORT || 8000;

//initialize the app
app.listen(PORT, (error) =>
  error ? console.log(error) : console.log(`Server running at port: ${PORT}`)
);
