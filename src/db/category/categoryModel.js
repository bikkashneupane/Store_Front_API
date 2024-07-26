import categorySchema from "./categorySchema.js";

// find category by filter
export const getCategories = (filter) => {
  return categorySchema.find(filter);
};
