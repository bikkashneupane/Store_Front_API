import userSchema from "./userSchema.js";

// create new user
export const insertUser = (obj) => {
  return userSchema(obj).save();
};

// return user by filter
export const getUser = (filter) => {
  return userSchema.findOne(filter);
};

// update user
export const updateUser = async (filter, obj) => {
  return userSchema.findOneAndUpdate(filter, obj);
};

// delete user
export const deleteUserById = (_id) => {
  return userSchema.findByIdAndDelete(_id);
};
