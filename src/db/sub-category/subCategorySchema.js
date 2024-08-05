import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    parentCategoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    brand: [
      {
        status: {
          type: String,
          default: "active",
        },
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
    ],
    material: [
      {
        status: {
          type: String,
          default: "active",
        },
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
    ],
    gender: [
      {
        type: String,
        enum: ["men", "women", "unisex"],
        default: "unisex",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SubCategory", schema);
