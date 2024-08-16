import express from "express";
import Stripe from "stripe";
import { updateOrder } from "../db/order/orderModel.js";

const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SK);

// Confirm Payment Success
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["stripe-signature"];

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
export default router;
