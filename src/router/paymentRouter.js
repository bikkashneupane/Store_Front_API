import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SK);

// create a payment intent
router.post("/create-payment-intent", async (req, res, next) => {
  try {
    const { amount, currency, paymentMethod } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: [paymentMethod],
    });

    console.log(paymentIntent);
    res.json({
      status: "success",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

// confirm order
router.post("/confrim-order", async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // handle order confirmation logic(save to database)

    res.json({
      status: "success",
      message: "Order Confirmed",
    });
  } catch (error) {
    next(error);
  }
});
export default router;
