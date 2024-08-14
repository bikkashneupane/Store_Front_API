import express from "express";
import Stripe from "stripe";
import {
  getOrderByFilter,
  insertOrder,
  updateOrder,
} from "../db/order/orderModel.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SK);

// create a payment intent
// save the order info in mongo db / update the order
router.post("/create-payment-intent", auth, async (req, res, next) => {
  try {
    const { amount, currency, orderId, ...rest } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: [
        "card",
        "link",
        "au_becs_debit",
        // "applepay","googlepay"
      ],
      metadata: { orderId: orderId },
    });

    //check if orderId present in db
    // not present add new
    // present update
    // save the order info in mongo db
    const order = await getOrderByFilter({ orderId });
    if (order?._id) {
      // update the order
      await updateOrder(
        { orderId },
        { ...rest, totalAmount, paymentIntentId: paymentIntent?.id }
      );
    }
    order?._id
      ? await updateOrder(
          { orderId },
          { ...rest, totalAmount, paymentIntentId: paymentIntent?.id }
        )
      : await insertOrder({
          ...rest,
          orderId,
          totalAmount: amount,
          paymentIntentId: paymentIntent?.id,
        });

    res.json({
      status: "success",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

// Confirm order
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET; // Use environment variable for security

      const signature = req.headers["stripe-signature"];

      // Construct the event
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );

      // Log the event for debugging
      console.log("Received event:", event);

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        console.log("PaymentIntent succeeded:", paymentIntent);

        // Update order status in the database
        const order = await updateOrder(
          { paymentIntentId: paymentIntent.id }, // Corrected field name
          { status: "Succeeded" }
        );
        console.log("Order updated:", order);
      }

      // Respond to Stripe to acknowledge receipt of the event
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook Error:", error.message);
      // Respond with an error status code
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

export default router;
