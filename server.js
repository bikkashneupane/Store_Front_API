import express from "express";
import morgan from "morgan";
import cors from "cors";
import { routes } from "./src/router/routers.js";
import { mongoConnect } from "./src/config/mongoConfig.js";
import stripeWebhookRouter from "./src/router/stripeWebhook.js";

const app = express();

// connect to mongoDB
mongoConnect();

//middlewares
app.use(cors());
app.use(morgan("dev"));

app.use("/v1/stripe", stripeWebhookRouter);

app.use(express.json());

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
  res.status(error.status || 500).json({
    message: error.message,
  });
});

const PORT = process.env.PORT || 8000;

//initialize the app
app.listen(PORT, (error) =>
  error ? console.log(error) : console.log(`Server running at port: ${PORT}`)
);
