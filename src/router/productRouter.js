import express from "express";
import { getProductByFilter, getProducts } from "../db/product/productModel.js";

const router = express.Router();

//get all active products
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

// get one product by id
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const product = await getProductByFilter({ _id });
    product?._id
      ? res.json({
          status: "success",
          message: "",
          product,
        })
      : res.json({
          status: "error",
          message: "Product Not Available, Please try again later",
        });
  } catch (error) {
    next(error);
  }
});

// get watches
router.get("/watches", async (req, res, next) => {
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
