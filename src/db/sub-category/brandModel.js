import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const brandSchema = mongoose.model("Brand", schema);

// find all Brand
export const getBrands = (filter) => {
  return brandSchema.find(filter);
};
