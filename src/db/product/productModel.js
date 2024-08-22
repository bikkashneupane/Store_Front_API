import productSchema from "./productSchema.js";

// find Product by Id
export const getProductByFilter = (filter) => {
  return productSchema.findOne(filter);
};

// find all Product
export const getProducts = (filter) => {
  return productSchema.find(filter);
};
