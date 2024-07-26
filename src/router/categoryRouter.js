import express from "express";
import { getCategories } from "../db/category/categoryModel.js";

const router = express.Router();

//get all active categories
router.get("/", async (req, res, next) => {
  try {
    const category = await getCategories({ status: "active" });
    res.json({
      status: "success",
      message: "",
      category,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
