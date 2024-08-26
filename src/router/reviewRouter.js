import express from "express";
import { getReviews, insertReview } from "../db/review/reviewModel.js";
import { auth } from "../middlewares/auth.js";
import { newReviewValidator } from "../middlewares/joi.js";
import { getOrderByFilter } from "../db/order/orderModel.js";

const router = express.Router();

//post review
router.post("/", auth, newReviewValidator, async (req, res, next) => {
  try {
    const { _id, firstName, lastName, profileImage } = req.userInfo;
    const { orderId, ...rest } = req.body;

    const productPurchased = await getOrderByFilter({
      orderId,
      userId: _id,
      status: "Succeeded",
    });

    if (productPurchased?._id) {
      const review = await insertReview({
        ...rest,
        userId: _id,
        userName: `${firstName} ${lastName}`,
        profileImage,
      });

      console.log(productPurchased);
      return review?._id
        ? res.json({
            status: "success",
            message: "Thank you for your review",
          })
        : res.json({
            status: "error",
            message: "Couldn't add review, add again",
          });
    }
    res.json({
      status: "error",
      message: "Please purchase before leaving review",
    });
  } catch (error) {
    next(error);
  }
});

// fetch reviews
router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews({ status: "active" });
    reviews.length
      ? res.json({
          status: "success",
          message: "",
          reviews,
        })
      : res.json({
          status: "error",
          message: "No reviews available currently.",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
