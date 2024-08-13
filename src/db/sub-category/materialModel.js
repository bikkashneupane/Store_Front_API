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

const materialSchema = mongoose.model("Material", schema);

// find all Material
export const getMaterials = (filter) => {
  return materialSchema.find(filter);
};
