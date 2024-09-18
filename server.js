import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { routes } from "./src/router/routers.js";
import { mongoConnect } from "./src/config/mongoConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import orderRouter from "./src/router/orderRouter.js";

const app = express();

// connect to mongoDB
mongoConnect();

//middlewares
app.use(cors());
app.use(morgan("dev"));

app.use("/v1/orders", orderRouter);

app.use(express.json());

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the .well-known directory
app.use("/.well-known", express.static(path.join(__dirname, ".well-known")));

// routes
routes.map(({ path, middlewares }) => {
  return app.use(path, middlewares);
});

// server route
app.get("/", (req, res, next) => {
  res.json({
    message: "Server Live...",
  });
});

// 404 error handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: "404 Path Not found",
  });
});

// global error handler
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    message: error.message,
  });
});

const PORT = process.env.PORT || 8010;

//initialize the app
app.listen(PORT, (error) =>
  error ? console.log(error) : console.log(`Server running at port: ${PORT}`)
);
