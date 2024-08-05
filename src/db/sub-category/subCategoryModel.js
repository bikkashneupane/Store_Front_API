import subCategorySchema from "./subCategorySchema.js";

// create new SubCategory
export const insertSubCategory = (obj) => subCategorySchema(obj).save();

// find all SubCategory
export const getSubCategories = (filter) => {
  return subCategorySchema.find(filter);
};
