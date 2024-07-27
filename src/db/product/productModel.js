import productSchema from "./productSchema.js";

// find Product by Id
export const getProductById = (_id) => {
  return productSchema.findById(_id);
};

// find all Product
export const getProducts = (filter) => {
  return productSchema.find(filter);
};
