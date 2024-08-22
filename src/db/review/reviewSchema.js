import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "active",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    userName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reviews", schema);
