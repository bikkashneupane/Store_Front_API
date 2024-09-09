import express from "express";
import Stripe from "stripe";
import {
  getOrderByFilter,
  getOrders,
  insertOrder,
  updateOrder,
} from "../db/order/orderModel.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SK);

// create a payment intent
// save the order info in mongo db / update the order
router.post(
  "/create-payment-intent",
  express.json(),
  auth,
  async (req, res, next) => {
    try {
      const { amount, currency, orderId, ...rest } = req.body;
      if (!amount || !currency || !orderId) {
        return res.status(400).json({
          status: "error",
          message: "Amount, currency, and orderId are required fields.",
        });
      }

      let paymentIntent;

      // Check if orderId already exists in the database
      const existingOrder = await getOrderByFilter({ orderId });

      if (existingOrder?._id) {
        try {
          // Retrieve the existing paymentIntent
          paymentIntent = await stripe.paymentIntents.retrieve(
            existingOrder?.paymentIntentId
          );
          // Update the paymentIntent with the new amount if necessary
          if (paymentIntent?.amount !== amount * 100) {
            paymentIntent = await stripe.paymentIntents.update(
              existingOrder?.paymentIntentId,
              {
                amount: amount * 100,
                currency,
                metadata: { orderId: orderId },
              }
            );
          }
        } catch (err) {
          return res.status(500).json({
            status: "error",
            message: "Failed to update payment intent.",
          });
        }
      } else {
        // Create a new paymentIntent if no existing order is found
        try {
          paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            payment_method_types: [
              "card",
              // "link",
              // "au_becs_debit",
            ],
            metadata: { orderId: orderId },
          });
        } catch (err) {
          return res.status(500).json({
            status: "error",
            message: "Failed to create payment intent.",
          });
        }
      }

      // Construct the order object
      const orderObj = {
        ...rest,
        amount,
        paymentIntentId: paymentIntent?.id,
      };

      // Update or create the order in the database
      try {
        existingOrder?.orderId
          ? await updateOrder({ orderId }, orderObj)
          : await insertOrder({
              ...orderObj,
              orderId,
            });
      } catch (err) {
        return res.status(500).json({
          status: "error",
          message: "Failed to save order information.",
          details: err.message,
        });
      }

      res.json({
        status: "success",
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Confirm Payment Success
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["stripe-signature"];

      const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        // Update order status in the database
        await updateOrder(
          { paymentIntentId: paymentIntent.id },
          { paymentStatus: "Succeeded", orderStatus: "confirmed" }
        );

        // send email to user with order receipt
      }

      // Return a 200 response to acknowledge receipt of the event
      res.send();
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

// find all my orders
router.get("/my-orders", auth, async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    const orders = await getOrders({ userId: _id, paymentStatus: "Succeeded" });
    orders?.length > 0
      ? res.json({ status: "success", orders })
      : res.json({ status: "error", message: "No Orders Found" });
  } catch (error) {
    next(error);
  }
});

export default router;
