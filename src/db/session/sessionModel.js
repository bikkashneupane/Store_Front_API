import sessionSchema from "./sessionSchema.js";

// create new Token
export const insertSession = (obj) => {
  return sessionSchema(obj).save();
};

// find Token
export const findSession = (filter) => {
  return sessionSchema.findOne(filter);
};

// delete a Token
export const deleteSession = (filter) => {
  return sessionSchema.findOneAndDelete(filter);
};

// delete many Tokens
export const deleteManySession = (filter) => {
  return sessionSchema.deleteMany(filter);
};
