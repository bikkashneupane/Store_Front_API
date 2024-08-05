import express from "express";
import { getCategories } from "../db/category/categoryModel.js";
import { getSubCategories } from "../db/sub-category/subCategoryModel.js";

const router = express.Router();

//get all active categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await getCategories({ status: "active" });
    res.json({
      status: "success",
      message: "",
      categories,
    });
  } catch (error) {
    next(error);
  }
});

//get all subcategories
router.get("/sub-category", async (req, res, next) => {
  try {
    const categories = await getSubCategories();
    res.json({
      status: "success",
      message: "",
      categories,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
