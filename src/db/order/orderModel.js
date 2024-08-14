import orderSchema from "./orderSchema.js";

// insert new order
export const insertOrder = (obj) => {
  return orderSchema(obj).save();
};

// find Order by Id
export const getOrderByFilter = (filter) => {
  return orderSchema.findOne(filter);
};

// find all Order
export const getOrders = (filter) => {
  return orderSchema.find(filter);
};

// update order
export const updateOrder = (filter, obj) => {
  return orderSchema.findOneAndUpdate(filter, obj, { new: true });
};
