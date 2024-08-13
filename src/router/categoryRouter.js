import express from "express";
import { getCategories } from "../db/category/categoryModel.js";
import { getBrands } from "../db/sub-category/brandModel.js";
import { getMaterials } from "../db/sub-category/materialModel.js";

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

// get all subcategories (brand/ materials)
router.get("/sub-categories", async (req, res, next) => {
  try {
    const brands = await getBrands();
    const materials = await getMaterials();

    if (brands?.length > 0 && materials?.length > 0) {
      return res.json({
        status: "success",
        message: "",
        brands,
        materials,
      });
    }
    res.json({
      status: "error",
      message: "Couldn't resolve request, try again",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
