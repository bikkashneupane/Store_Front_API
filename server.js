import express from "express";
import morgan from "morgan";
import cors from "cors";
import { routes } from "./src/router/routers.js";
import { mongoConnect } from "./src/config/mongoConfig.js";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const stripe = Stripe(process.env.STRIPE_SK);

// connect to mongoDB
mongoConnect();

//middlewares
app.use(cors());
app.use(morgan("dev"));

// Confirm Payment Success
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["stripe-signature"];
      console.log("SIgnature : ", signature);

      const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

      let event;

      console.log("rawBody", req.body);
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
        console.log("Event: ", event);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        console.log("PaymentIntent succeeded: ", paymentIntent);

        // Update order status in the database
        const order = await updateOrder(
          { paymentIntentId: paymentIntent.id },
          { status: "Succeeded" }
        );
        console.log("Order updated:", order);
      }

      // Return a 200 response to acknowledge receipt of the event
      res.send();
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

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
  res.status(error.status || 500).json({
    message: error.message,
  });
});

const PORT = process.env.PORT || 8000;

//initialize the app
app.listen(PORT, (error) =>
  error ? console.log(error) : console.log(`Server running at port: ${PORT}`)
);
