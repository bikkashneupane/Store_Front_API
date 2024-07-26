import productSchema from "./productSchema.js";

// find Product
export const getOneProduct = (filter) => {
  return productSchema.findOne(filter);
};

// find all Product
export const getProducts = (filter) => {
  return productSchema.find(filter);
};
