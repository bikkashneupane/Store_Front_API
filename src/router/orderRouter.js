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

    if (!amount || !currency || !orderId) {
      return res.status(400).json({
        status: "error",
        message: "Amount, currency, and orderId are required fields.",
      });
    }

    let paymentIntent;

    // Check if orderId already exists in the database
    const existingOrder = await getOrderByFilter({ orderId });
    console.log("Exisiting Order: ", existingOrder);

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
        console.log("Update failed", err);
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
            "link",
            // "au_becs_debit",
            // "applepay","googlepay"
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
      console.log("Existing Order Id", existingOrder?.orderId);
      console.log("Current Order Id", orderId);
      existingOrder?.orderId
        ? await updateOrder({ orderId }, orderObj)
        : await insertOrder({
            ...orderObj,
            orderId,
          });
    } catch (err) {
      console.log("error message: ", err);
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
});

export default router;
