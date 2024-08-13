import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    brand: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Brands",
      },
    ],
    material: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Materials",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", schema);
