import express from "express";
import { getProducts } from "../db/product/productModel.js";

const router = express.Router();

//get all active categories
router.get("/", async (req, res, next) => {
  try {
    const products = await getProducts({ status: "active" });
    products.length
      ? res.json({
          status: "success",
          message: "",
          products,
        })
      : res.json({
          status: "error",
          message: "No products available currently.",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
